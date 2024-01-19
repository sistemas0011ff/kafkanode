
// import { Confirmation } from "../application/interfaces/graphql/Confirmation";

// // export interface ICommandResult {}
// export interface ICommandResult {
//     confirmation: Confirmation;
//     shipment: any;  // Replace with your actual shipment class.
// }

export interface ICommandResult<T = any, C = any> {
    result: T;
    value: C;
}