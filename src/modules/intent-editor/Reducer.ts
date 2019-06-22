import { combineReducers, AnyAction } from 'redux';
import merge from 'lodash-es/merge';
import reduce from 'lodash-es/reduce';
import reject from 'lodash-es/reject';
import isNil from 'lodash-es/isNil';
import map from 'lodash-es/map';
import defaultTo from 'lodash-es/defaultTo';

import { types } from './Action';
import { UPDATE_RESPONSE_SUCCESSFUL, DELETE_RESPONSE_SUCCESSFUL } from './response-editor/Reducer';
import { reducer as category } from './intent-category';
import { reducer as editor } from './response-editor';
import { reducer as creator, types as newResponseTypes } from './new-response-creator';
import { asyncFetching, asyncSuccessful, asyncFailure } from '../../commons/AsyncActions';

export const ASYNC_FETCHING_RESOURCES = asyncFetching(types.ASYNC_FETCH_RESOURCES);
export const ASYNC_FETCHING_PENDING_RESOURCES = asyncFetching(types.ASYNC_FETCH_PENDING_RESOURCES);
export const ASYNC_SUCCESSFUL_RESOURCES = asyncSuccessful(types.ASYNC_FETCH_RESOURCES);
export const ASYNC_SUCCESSFUL_PENDING_RESOURCES =
  asyncSuccessful(types.ASYNC_FETCH_PENDING_RESOURCES);
export const ASYNC_FAILURE_RESOURCES = asyncFailure(types.ASYNC_FETCH_RESOURCES);
const ASYNC_SUCCESSFUL_CREATE_PENDING_RESOURCES =
  asyncSuccessful(newResponseTypes.ASYNC_SUBMIT_REQUEST);

function reduceApiResponse(data: {}) {
  return reduce(
    reject(data, isNil),
    (resources, resource: { [key: string]: any }) => {
      const {
       category, subCategory, id, sampleQuestion, responses, response, pendingAction,
      } = resource;

      if (isNil(resources[category])) {
        resources[category] = {};
      }

      if (isNil(resources[category][subCategory])) {
        resources[category][subCategory] = {};
      }

      resources[category][subCategory][id] = {
        id,
        sampleQuestion,
        responses,
        response,
        pendingAction,
      };

      return resources;
    },
    {} as { [key: string]: any },
  );
}

const resources = (status: any = {}, action: AnyAction) => {
  if (action.type === ASYNC_SUCCESSFUL_RESOURCES) {
    return reduceApiResponse(action.payload);
  }

  if (action.type === UPDATE_RESPONSE_SUCCESSFUL) {
    return merge({}, status, reduceApiResponse(action.payload));
  }

  if (action.type === DELETE_RESPONSE_SUCCESSFUL) {
    const [category, subcate, id] = action.payload.split('.');
    const tobeDeleted = {
      [category]: {
        [subcate]: {
          [id]: {
            ...status[category][id],
            pendingAction: 'DELETE',
          },
        },
      },
    };

    return merge({}, status, tobeDeleted);
  }

  return status;
};

const pendingResources = (resources = {}, action: AnyAction) => {

  if (action.type === ASYNC_SUCCESSFUL_PENDING_RESOURCES) {
    return reduceApiResponse(map(action.payload, (item: any) => {
      const { id, payload } = item;
      return { id, ...payload };
    }));
  }

  if (action.type === ASYNC_SUCCESSFUL_CREATE_PENDING_RESOURCES) {
    return merge({}, resources, reduceApiResponse([{
      id: action.payload.id,
      ...action.payload.payload,
    }]));
  }

  return resources;
};

const searchTerm = (status = '', action: AnyAction) => {
  switch (action.type) {
    case types.UPDATE_SEARCH_TERM:
      return action.payload.status;
    default:
      return status;
  }
};

const currentPage = (status = 'mainPage', action: AnyAction) => {
  switch (action.type) {
    case types.UPDATE_PAGE_STATUS:
      return action.payload.status;
    default:
      return status;
  }
};

export default combineReducers({
  category,
  currentPage,
  resources,
  pendingResources,
  editor,
  creator,
  searchTerm,
});
