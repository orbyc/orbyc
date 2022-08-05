import { createContext, useReducer } from 'react';
import { DataSource } from './datasource';

interface IAction {
  type: 'ADD_DATASOURCE' | 'REMOVE_DATASOURCE';
}

interface IDataSourceAction extends IAction {
  payload: DataSource;
}

type Action = IAction | IDataSourceAction;

type State = {
  datasource?: DataSource;
};

export const addDataSource = (payload: DataSource): IDataSourceAction => ({
  type: 'ADD_DATASOURCE',
  payload,
});

export const removeDataSource = (): IAction => ({ type: 'REMOVE_DATASOURCE' });

const reducer: React.Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'ADD_DATASOURCE':
      const { payload: datasource } = action as IDataSourceAction;
      return { datasource };
    case 'REMOVE_DATASOURCE':
      return {};
    default:
      return prevState;
  }
};

interface DataSourceContextDomain {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const DataSourceContext = createContext({} as DataSourceContextDomain);

interface DataSourceProviderProps {
  children?: React.ReactNode;
}

export function DataSourceProvider(props: DataSourceProviderProps) {
  const [state, dispatch] = useReducer(reducer, {});
  return (
    <DataSourceContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DataSourceContext.Provider>
  );
}
