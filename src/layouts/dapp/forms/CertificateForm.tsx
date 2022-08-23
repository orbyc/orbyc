import { Certificate } from "orbyc-core/pb/domain_pb";
import { CertificateMetadata } from "orbyc-core/pb/metadata_pb";
import { decodeHex, encodeHex } from "orbyc-core/utils/encoding";

import { Form, Formik, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import StepForm from "./StepForm";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { SubmitFormProps } from "./AssetForm";
import { useContext } from "react";
import { DataSourceContext } from "providers/blockchain/provider";

const validationSchema = yup.object({});

export function CertificateForm() {
  const { state } = useContext(DataSourceContext);
  const { erc245 } = state.datasource!;

  const certificate = new Certificate();
  const metadata = CertificateMetadata.deserializeBinary(
    decodeHex(certificate.getMetadata())
  );

  /* parse creation date */
  const issuanceTimestamp = metadata.getDate();
  const issuanceDate = new Date();
  if (issuanceTimestamp) {
    issuanceDate.setUTCSeconds(issuanceTimestamp.getSeconds());
  }

  /* steps forms */
  const GeneralForm = () => (
    <div>
      <div>
        <label htmlFor="id">Serial number</label>
        <Field type="number" name="id" />
        <ErrorMessage name="id" component="div" />
      </div>
      <div>
        <label htmlFor="issuedat">Issuance date</label>
        <Field type="datetime-local" name="issuedat" />
        <ErrorMessage name="issuedat" component="div" />
      </div>
      <div>
        <label htmlFor="url">Certificate URL</label>
        <Field type="text" name="url" />
        <ErrorMessage name="url" component="div" />
      </div>
      <div>
        <label htmlFor="attachment">File</label>
        <Field type="text" name="attachment" />
        <ErrorMessage name="attachment" component="div" />
      </div>
    </div>
  );

  const PublishForm = ({ isSubmitting }: SubmitFormProps) => (
    <>
      <button type="submit" disabled={isSubmitting}>
        Publish to Blockchain
      </button>
    </>
  );

  return (
    <Formik
      initialValues={{
        ...certificate.toObject(),
        ...metadata.toObject(),

        issuedat: issuanceDate.toString(),
      }}
      validationSchema={validationSchema}
      onSubmit={async (data, { setSubmitting }) => {
        try {
          const metadata = new CertificateMetadata();
          metadata.setAttachment(data.attachment);
          metadata.setDate(
            new Timestamp().setSeconds(Date.parse(data.issuedat))
          );
          metadata.setUrl(data.url);

          const cert = new Certificate();
          cert.setId(data.id);
          cert.setMetadata(encodeHex(metadata.serializeBinary()));

          const transaction = await erc245.issueCertificate(cert);
          console.log({ transaction });
        } catch ({ message }) {
          console.log({ message });
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <StepForm
          steps={[
            { label: "General", element: <GeneralForm /> },
            {
              label: "Publish",
              element: <PublishForm isSubmitting={isSubmitting} />,
            },
          ]}
        >
          {(body) => <Form>{body}</Form>}
        </StepForm>
      )}
    </Formik>
  );
}
