import 'whatwg-fetch';
import { Moment } from 'moment';
import * as queryString from 'query-string';
import last from 'lodash-es/last';
import isNil from 'lodash-es/isNil';
import { Pageable } from './Page';
import { ConversationStatus } from './Constants';
import { List } from 'lodash';

interface Request {
  [key: string]: any;
}

enum SupportedMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

class Api {

  // tslint:disable-next-line max-line-length
  private token: string = '';

  constructor(private readonly baseUrl: string) {
    const token = sessionStorage.getItem('token');
    if (!isNil(token)) {
      this.setToken(token);
    }
  }

  getToken() {
    return this.token;
  }
  setToken(value: string) {
    this.token = value;
  }

  addQueryParameter(url: string, requestBody: any) {
    let newUrl: string = url;
    newUrl = `${url}?${queryString.stringify(requestBody)}`;
    return newUrl;
  }

  createFileUrl(senderInfo: string, messageId: string) {
    let fileUrl: string = `${this.baseUrl}/conversations/` +
      `${senderInfo}/messages/${messageId}/file`;
    fileUrl = this.addQueryParameter(fileUrl, { token: this.token });
    return fileUrl;
  }

  protected createRequest(method: SupportedMethod, body?: any) {
    if (this.token === undefined) {
      throw new Error('Token not found');
    }

    const request: Request = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.token}`,
      },
    };

    if (body && method !== SupportedMethod.GET) {
      request.body = JSON.stringify(body);
    }

    return request;
  }

  protected pageQuery(pageable?: Pageable) {
    if (!isNil(pageable)) {
      return {
        page: pageable.pageNumber,
        size: pageable.pageSize,
        sort: pageable.sorts.map(s => `${s.name},${s.direction}`).join('|'),
      };
    }
    return {};
  }

  protected async execute(
    path: string,
    method: SupportedMethod = SupportedMethod.GET,
    requestBody?: any) {

    try {
      const url = method === SupportedMethod.GET && requestBody
        ? this.addQueryParameter(`${this.baseUrl}${path}`, requestBody)
        : `${this.baseUrl}${path}`;
      const response = await fetch(url, {
        ...this.createRequest(method, requestBody),
        method,
      });
      const body: any = await response.json();

      if (response.status >= 400) {
        throw body;
      }

      return body.payload;
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw {
          statusCode: 0,
          error: 'Unknown error',
          message: 'Unknown error',
        };
      }
    }
  }

  async fetchSuspendAutoReplyConfig() {
    return this.execute('/controls/auto-reply');
  }

  async updateSuspendAutoReplyConfig(value: boolean) {
    return this.execute(`/controls/auto-reply/${value ? 'on' : 'off'}`, SupportedMethod.PUT);
  }

  async login(username: string, password: string, uni: string) {
    return this.execute(
      '/users/token',
      SupportedMethod.POST,
      {
        username,
        password,
        uni,
      });
  }

  async fetchTokenTypes() {
    return this.execute('/users/types');
  }

  async fetchResources() {
    return this.execute('/resources');
  }

  async fetchPendingResources() {
    return this.execute('/resources?pending');
  }

  async validateUser() {
    return this.execute('/users/validate');
  }

  async updateResponse(data: any) {
    const { resourceId, responses, sampleQuestion, originSampleQuestion } = data;
    const hasChangedSampleQuestion = sampleQuestion !== originSampleQuestion;
    return this.execute(`/resources/${resourceId}`, SupportedMethod.PATCH, {
      responses,
      sampleQuestion: hasChangedSampleQuestion ? sampleQuestion : undefined,
    });
  }

  async createNewResponse(data: any) {
    return this.execute('/resources', SupportedMethod.PUT, {
      ...data,
    });
  }

  async deleteResponse(data: any) {
    const { responseName } = data;
    const resourceId = last(responseName.split('.'));
    return this.execute(`/resources/${resourceId}`, SupportedMethod.DELETE);
  }

  async fetchTrafficStatistics(parameters: {
    start: Moment,
    end: Moment,
    type: string,
    group: string,
  }) {
    return this.execute(`/data-analytics/traffic`, SupportedMethod.GET, {
      ...parameters,
      start: parameters.start.format(),
      end: parameters.end.format(),
    });
  }

  async fetchAutoReplyCommentStatistics(parameters: {
    start: Moment,
    end: Moment,
    type: string,
    group: string,
  }) {
    return this.execute(`/data-analytics/message-comments`, SupportedMethod.GET, {
      ...parameters,
      start: parameters.start.format(),
      end: parameters.end.format(),
    });
  }

  async fetchConversations(status: ConversationStatus, query: string, pageable?: Pageable) {
    return this.execute(`/conversations`, SupportedMethod.GET, {
      ...this.pageQuery(pageable),
      query,
      status: status === ConversationStatus.ALL ? undefined : status,
    });
  }

  async fetchConversationMessages(conversationsId: string, pageable?: Pageable) {
    return this.execute(`/conversations/${conversationsId}/messages`, SupportedMethod.GET, {
      ...this.pageQuery(pageable),
    });
  }

  async sendConversationMessages(conversationsId: string, message: string) {
    return this.execute(`/conversations/${conversationsId}/messages`, SupportedMethod.POST, {
      message,
    });
  }

  async closeConversation(conversationsId: string) {
    return this.execute(`/conversations/${conversationsId}/issues/close`, SupportedMethod.POST);
  }

  async seenConversation(conversationsId: string) {
    return this.execute(`/conversations/${conversationsId}/seen`, SupportedMethod.POST);
  }

  async clickConversationSuggestedAnswer(conversationsId: string) {
    return this.execute(
      `/conversations/${conversationsId}/suggested-answer-click`,
      SupportedMethod.POST,
    );
  }

  async fetchSuggestions(msg: string) {
    return this.execute('/conversations/suggestions', SupportedMethod.POST, {
      msg,
    });
  }

  async mapResponseToRequest(responses: string[], requests: string[]) {
    return this.execute('/conversations/request-response-mappings', SupportedMethod.POST, {
      responses,
      requests,
    });
  }

  async submitCommentRating(conversationId: string, messageId: string, data: any) {
    const path = `/conversations/${conversationId}/messages/${messageId}`;
    return this.execute(path, SupportedMethod.PATCH, data);
  }

  async sendEmail(mailTo: string[], subject: string, body: string) {
    const path = `/conversations/email`;
    return this.execute(path, SupportedMethod.POST, {
      subject,
      body,
      to: mailTo,
    });
  }
}

const api = new Api(process.env.BASE_URL as string);

export { Request, SupportedMethod, Api, api };
