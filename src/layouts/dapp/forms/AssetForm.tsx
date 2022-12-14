import { Asset } from "orbyc-core/pb/domain_pb";
import {
  AssetMetadata,
  Image,
  Link,
  Location,
} from "orbyc-core/pb/metadata_pb";
import { decodeHex, encodeHex } from "orbyc-core/utils/encoding";

import { Form, Formik, FieldArray, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import StepForm from "./StepForm";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { useContext } from "react";
import { DataSourceContext } from "providers/blockchain/provider";

import "./FormStyle.scss";

interface FormProps {
  values: AssetMetadata.AsObject & Asset.AsObject;
}

interface Composition {
  parentid: number;
  percent: number;
}

interface AssetRelations {
  traceabilityList: number[];
  compositionsList: Composition[];
  certificatesList: number[];
}

interface AssetRelationsFormProps {
  values: AssetRelations;
}

interface AssetFormProps {
  assetid: number;
}

export interface SubmitFormProps {
  isSubmitting?: boolean;
}

const PublishForm = ({ isSubmitting }: SubmitFormProps) => (
  <>
    <button type="submit" className="btn-add" disabled={isSubmitting}>
      Publish to Blockchain
    </button>
  </>
);

const validationSchema = yup.object({});

export function AssetForm() {
  const { state } = useContext(DataSourceContext);
  const { erc245 } = state.datasource!;

  /* load asset data TODO: get as dependencies */
  const asset = new Asset();
  const metadata = AssetMetadata.deserializeBinary(
    decodeHex(asset.getMetadata())
  );

  /* parse creation date */
  const creationTimestamp = metadata.getCreation()?.getDate();
  const creationDate = new Date();
  if (creationTimestamp) {
    creationDate.setUTCSeconds(creationTimestamp.getSeconds());
  }

  /* steps forms */
  const GeneralForm = () => (
    <div>
      <div className="general-form">
        <label htmlFor="id">Serial number: </label>
        <Field className="input-field" type="number" name="id" placeholder="#0000000" />
        <ErrorMessage name="id" component="div" />
      </div>
      <div className="general-form">
        <label htmlFor="owner">Owner:</label>
        <Field className="input-field" type="text" name="owner"  placeholder="owner" />
        <ErrorMessage name="owner" component="div" />
      </div>
      <div  className="general-form">
        <label htmlFor="name">Asset name: </label>
        <Field className="input-field" type="text" name="name" placeholder="asset name"/>
        <ErrorMessage name="name" component="div" />
      </div>
      <div  className="general-form">
        <label htmlFor="description">Description: </label>
        <Field className="input-field" type="text" name="description" placeholder="description"/>
        <ErrorMessage name="description" component="div" />
      </div>
      <div className="general-form">
        <label htmlFor="co2e">Carbon Emissions: </label>
        <Field className="input-field" type="number" name="co2e" placeholder="co2e" />
        <ErrorMessage name="co2e" component="div" />
      </div>
      <div  className="general-form">
        <label htmlFor="certid">Emissions certificate: </label>
        <Field className="input-field" type="number" name="certid" />
        <ErrorMessage name="certid" component="div" />
      </div>
      {/* <div>
        <label htmlFor="header">Header message</label>
        <Field type="text" name="header" />
        <ErrorMessage name="header" component="div" />
      </div>
      <div>
        <label htmlFor="background.attachment">Header image</label>
        <Field type="text" name="background.attachment" />
        <ErrorMessage name="background.attachment" component="div" />
      </div> */}
    </div>
  );

  const PropertiesForm = ({ values }: FormProps) => (
    <FieldArray name="propertiesList">
      {({ remove, push }) => (
        <>
          {values.propertiesList &&
            values.propertiesList.map((_, index) => (
              <div key={index}>
                <div className="general-form">
                  <label htmlFor={`propertiesList.${index}.name`}>Name</label>
                  <Field className="input-field" name={`propertiesList.${index}.name`} type="text" />
                  <ErrorMessage
                    name={`propertiesList.${index}.name`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="general-form">
                  <label htmlFor={`propertiesList.${index}.value`}>Value</label>
                  <Field className="input-field" name={`propertiesList.${index}.value`} type="text" />
                  <ErrorMessage
                    name={`propertiesList.${index}.value`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="general-form">
                  <label htmlFor={`propertiesList.${index}.icon`}>Unit</label>
                  <Field className="input-field" name={`propertiesList.${index}.icon`} type="text" />
                  <ErrorMessage
                    name={`propertiesList.${index}.icon`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="btn-add"
            onClick={() => {
              const element: AssetMetadata.Property.AsObject = {
                icon: "",
                name: "",
                value: "",
              };
              push(element);
            }}
          >
            Add Property
          </button>
        </>
      )}
    </FieldArray>
  );

  const GalleryForm = ({ values }: FormProps) => (
    <FieldArray name="imagesList">
      {({ remove, push }) => (
        <>
          {values.imagesList &&
            values.imagesList.map((_, index) => (
              <div key={index}>
                <div className="general-form">
                  <label htmlFor={`imagesList.${index}.name`}>Name</label>
                  <Field className="input-field" name={`imagesList.${index}.name`} type="text" />
                  <ErrorMessage
                    name={`imagesList.${index}.name`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="general-form">
                  <label htmlFor={`imagesList.${index}.attachment`}>
                    Attachment
                  </label>
                  <Field className="input-field" name={`imagesList.${index}.attachment`} type="text" />
                  <ErrorMessage
                    name={`imagesList.${index}.attachment`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="btn-add"
            onClick={() => {
              const element: Image.AsObject = { attachment: "", name: "" };
              push(element);
            }}
          >
            Add Image
          </button>
        </>
      )}
    </FieldArray>
  );

  const CreationForm = () => (
    <div>
      <div className="general-form">
        <label htmlFor="createdAt">Creation date</label>
        <Field className="input-field" type="datetime-local" name="createdAt" />
        <ErrorMessage name="createdAt" component="div" />
      </div>
      <div className="general-form">
        <label htmlFor="creation.location">City</label>
        <Field className="input-field" type="text" name="creation.location" />
        <ErrorMessage name="creation.location" component="div" />
      </div>
      <div className="general-form">
        <label htmlFor="creation.country">Country</label>
        <Field className="input-field" type="text" name="creation.country" />
        <ErrorMessage name="creation.country" component="div" />
      </div>
      {/* <div>
        <label htmlFor="creation.lat">Latitude</label>
        <Field type="text" name="creation.lat" />
        <ErrorMessage name="creation.lat" component="div" />
      </div>
      <div>
        <label htmlFor="creation.lng">Longitude</label>
        <Field type="text" name="creation.lng" />
        <ErrorMessage name="creation.lng" component="div" />
      </div> */}
    </div>
  );

  const LinksForm = ({ values }: FormProps) => (
    <FieldArray name="linksList">
      {({ remove, push }) => (
        <>
          {values.linksList &&
            values.linksList.map((_, index) => (
              <div key={index}>
                <div className="general-form">
                  <label htmlFor={`linksList.${index}.name`}>Name</label>
                  <Field className="input-field" name={`linksList.${index}.name`} type="text" />
                  <ErrorMessage
                    name={`linksList.${index}.name`}
                    component="div"
                    className="field-error"
                  />
                </div>
                {/* <div className="row">
                  <label htmlFor={`linksList.${index}.icon`}>Icon</label>
                  <Field name={`linksList.${index}.icon`} type="text" />
                  <ErrorMessage
                    name={`linksList.${index}.icon`}
                    component="div"
                    className="field-error"
                  />
                </div> */}
                <div className="general-form">
                  <label htmlFor={`linksList.${index}.url`}>Url</label>
                  <Field className="input-field" name={`linksList.${index}.url`} type="text" />
                  <ErrorMessage
                    name={`linksList.${index}.url`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="btn-add"
            onClick={() => {
              const element: Link.AsObject = { icon: "", name: "", url: "" };
              push(element);
            }}
          >
            Add External Link
          </button>
        </>
      )}
    </FieldArray>
  );

  return (
    <Formik
      initialValues={{
        ...asset.toObject(),
        ...metadata.toObject(),
        createdAt: creationDate.toString(),
      }}
      validationSchema={validationSchema}
      onSubmit={async (data, { setSubmitting }) => {
        try {
          const background = new Image();
          if (data.background) {
            background.setAttachment(data.background.attachment);
            background.setName(data.background.name);
          }

          const creation = new Location();
          if (data.creation) {
            creation.setCountry(data.creation.country);
            creation.setDate(
              new Timestamp().setSeconds(Date.parse(data.createdAt))
            );
            creation.setLat(data.creation.lat);
            creation.setLng(data.creation.lng);
            creation.setLocation(data.creation.location);
          }

          const images = data.imagesList.map(({ attachment, name }) => {
            const image = new Image();
            image.setAttachment(attachment);
            image.setName(name);
            return image;
          });

          const links = data.linksList.map(({ icon, name, url }) => {
            const link = new Link();
            link.setIcon(icon);
            link.setName(name);
            link.setUrl(url);
            return link;
          });

          const properties = data.propertiesList.map(
            ({ icon, name, value }) => {
              const property = new AssetMetadata.Property();
              property.setIcon(icon);
              property.setName(name);
              property.setValue(value);
              return property;
            }
          );

          const metadata = new AssetMetadata();
          metadata.setBackground(background);
          metadata.setCreation(creation);
          metadata.setDescription(data.description);
          metadata.setHeader(data.header);
          metadata.setName(data.name);
          metadata.setImagesList(images);
          metadata.setLinksList(links);
          metadata.setPropertiesList(properties);

          const asset = new Asset();
          asset.setCertid(data.certid);
          asset.setCo2e(data.co2e);
          asset.setId(data.id);
          asset.setOwner(data.owner);
          asset.setMetadata(encodeHex(metadata.serializeBinary()));

          const transaction = await erc245.issueAsset(asset);
          console.log("working");
          console.log({ transaction });

          setSubmitting(false);
        } catch (error) {
          console.log({ error });
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <StepForm
          steps={[
            { label: "General", element: <GeneralForm /> },
            {
              label: "Properties",
              element: <PropertiesForm values={values} />,
            },
            { label: "Gallery", element: <GalleryForm values={values} /> },
            { label: "Creation", element: <CreationForm /> },
            { label: "Links", element: <LinksForm values={values} /> },
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

/*
  ASSET TRACEABILITY
*/

export function AssetTraceabilityForm(props: AssetFormProps) {
  const { state } = useContext(DataSourceContext);
  const { erc245 } = state.datasource!;

  const relations: AssetRelations = {
    traceabilityList: [],
    compositionsList: [],
    certificatesList: [],
  };

  const TraceabilityForm = ({ values }: AssetRelationsFormProps) => (
    <FieldArray name="traceabilityList">
      {({ remove, push }) => (
        <>
          {values.traceabilityList &&
            values.traceabilityList.map((_, index) => (
              <div key={index}>
                <div className="row">
                  <label htmlFor={`traceabilityList.${index}`}>
                    Movement Id
                  </label>
                  <Field name={`traceabilityList.${index}`} type="number" />
                  <ErrorMessage
                    name={`traceabilityList.${index}`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="secondary"
            onClick={() => {
              const element: number = 0;
              push(element);
            }}
          >
            Add Movement
          </button>
        </>
      )}
    </FieldArray>
  );

  return (
    <Formik
      initialValues={{ ...relations }}
      validationSchema={validationSchema}
      onSubmit={async (data, { setSubmitting }) => {
        try {
          const transaction = await erc245.addMovements(
            props.assetid,
            data.traceabilityList
          );
          console.log({ transaction });
          setSubmitting(false);
        } catch (error) {
          console.log({ error });
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <StepForm
          steps={[
            {
              label: "Traceability",
              element: <TraceabilityForm values={values} />,
            },
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

/*
  ASSET COMPOSITION
*/

export function AssetCompositionForm(props: AssetFormProps) {
  const { state } = useContext(DataSourceContext);
  const { erc245 } = state.datasource!;

  const relations: AssetRelations = {
    traceabilityList: [],
    compositionsList: [],
    certificatesList: [],
  };

  const CompositionForm = ({ values }: AssetRelationsFormProps) => (
    <FieldArray name="compositionsList">
      {({ remove, push }) => (
        <>
          {values.compositionsList &&
            values.compositionsList.map((_, index) => (
              <div key={index}>
                <div className="row">
                  <label htmlFor={`compositionsList.${index}.parentid`}>
                    Parent Id
                  </label>
                  <Field
                    name={`compositionsList.${index}.parentid`}
                    type="number"
                  />
                  <ErrorMessage
                    name={`compositionsList.${index}.parentid`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="row">
                  <label htmlFor={`compositionsList.${index}.percent`}>
                    Percent
                  </label>
                  <Field
                    name={`compositionsList.${index}.percent`}
                    type="number"
                    max="100"
                    min="1"
                  />
                  <ErrorMessage
                    name={`compositionsList.${index}.percent`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="secondary"
            onClick={() => {
              const element: Composition = { parentid: 0, percent: 50 };
              push(element);
            }}
          >
            Add Parent
          </button>
        </>
      )}
    </FieldArray>
  );

  return (
    <Formik
      initialValues={{ ...relations }}
      validationSchema={validationSchema}
      onSubmit={async (data, { setSubmitting }) => {
        try {
          const percents = data.compositionsList.map((e) => e.percent);
          const parents = data.compositionsList.map((e) => e.parentid);

          const transaction = await erc245.addParents(
            props.assetid,
            parents,
            percents
          );
          console.log({ transaction });
          setSubmitting(false);
        } catch (error) {
          console.log({ error });
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <StepForm
          steps={[
            {
              label: "Composition",
              element: <CompositionForm values={values} />,
            },
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

/*
  ASSET CERTIFICATES
*/

export function AssetCertificatesForm(props: AssetFormProps) {
  const { state } = useContext(DataSourceContext);
  const { erc245 } = state.datasource!;

  const relations: AssetRelations = {
    traceabilityList: [],
    compositionsList: [],
    certificatesList: [],
  };

  const CertificatesForm = ({ values }: AssetRelationsFormProps) => (
    <FieldArray name="certificatesList">
      {({ remove, push }) => (
        <>
          {values.certificatesList &&
            values.certificatesList.map((_, index) => (
              <div key={index}>
                <div className="row">
                  <label htmlFor={`certificatesList.${index}`}>
                    Certificate Id
                  </label>
                  <Field name={`certificatesList.${index}`} type="number" />
                  <ErrorMessage
                    name={`certificatesList.${index}`}
                    component="div"
                    className="field-error"
                  />
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

          <button
            type="button"
            className="secondary"
            onClick={() => {
              const element: number = 0;
              push(element);
            }}
          >
            Add Certificate
          </button>
        </>
      )}
    </FieldArray>
  );

  return (
    <Formik
      initialValues={{ ...relations }}
      validationSchema={validationSchema}
      onSubmit={async (data, { setSubmitting }) => {
        try {
          const transaction = await erc245.addAssetCertificates(
            props.assetid,
            data.certificatesList
          );
          console.log({ transaction });
          setSubmitting(false);
        } catch (error) {
          console.log({ error });
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting }) => (
        <StepForm
          steps={[
            {
              label: "Certificates",
              element: <CertificatesForm values={values} />,
            },
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
