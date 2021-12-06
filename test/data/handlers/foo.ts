import { IDictionary, IServerlessFunction, scalar } from "common-types";

export type IWrapperContext<
  _I,
  _O,
  _Q extends IQueryParameters = IQueryParameters,
  _P extends IPathParameters = IPathParameters
> = Omit<any, "identity"> & any & any;

export type IQueryParameters = IDictionary<scalar>;
export type IPathParameters = IDictionary<scalar>;

export type IHandlerFunction<
  I,
  O,
  Q extends IQueryParameters = IQueryParameters,
  P extends IQueryParameters = IQueryParameters
> = (event: I, context: IWrapperContext<I, O, Q, P>) => Promise<O>;

export type IHandlerConfig = Omit<IServerlessFunction & { handler: string }, "handler">;

export const config: IHandlerConfig = {
  description: "Something profound",
  events: [
    {
      http: {
        method: "post",
        path: "/sms/chat",
        cors: true,
        authorizer: "${self:custom.authorizer}",
      },
    },
  ],
};

/**
 * This is a test description along with parameter info detailed
 *
 * @param _request
 * @param _context
 */
export const fn: IHandlerFunction<void, void> = async (_request, _context) => {
  //
};
