// import express, { Request, Response, NextFunction } from "express";
// import Stripe from "stripe";
// import dotenv from 'dotenv';
// import { AppError } from "../../../lib/error";
// import { ReturnValue } from "@aws-sdk/client-dynamodb";
// import { THIRTYDAYS } from "../../../lib/constants/dates";
// import { dynamoDB } from "../../../db/dal";
// import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
//
// // Ensure that STRIPE_SECRET_KEY is loaded
// dotenv.config();
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not defined in the environment");
// }
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2024-09-30.acacia',  // Use the version expected by your project
// });
//
// interface BodyProps {
//   paymentMethodId: string;
//   customerId: string;
//   priceId: string;
//   email: string;
//   userPlan: string;
// }
//
// export const stripeSubscription: express.RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { paymentMethodId, customerId, priceId, email, userPlan }: BodyProps =
//       req.body;
//
//     let customer;
//
//     // If no customer ID is passed, create a new customer
//     if (!customerId) {
//       customer = await stripe.customers.create({
//         payment_method: paymentMethodId, // attach payment method during customer creation
//       });
//     } else {
//       try {
//         customer = await stripe.customers.retrieve(customerId);
//       } catch (err) {
//         // Handle the case where the customer retrieval fails
//         return next(
//           new AppError("Failed to retrieve customer from Stripe", 400, (err as Error).message, true)
//         );
//       }
//     }
//
//     // Create the subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       default_payment_method: paymentMethodId,
//       expand: ["latest_invoice.payment_intent"],  // Ensure that payment_intent is expanded
//     });
//
//     // if (!subscription || !subscription.latest_invoice || !subscription.latest_invoice?.payment_intent) {
//     if (!subscription || !subscription.latest_invoice) {
//       return next(
//         new AppError(
//           "Internal server error",
//           500,
//           "Failed to create subscription or retrieve payment intent",
//           true
//         )
//       );
//     }
//
//     // Access payment_intent safely
//     // const paymentIntent = subscription.latest_invoice?.payment_intent;
//
//     // Prepare the update params for DynamoDB
//     const updateParams = {
//       TableName: "Users",
//       Key: {
//         email: email,
//         acc_type: "email", // Make sure the account type ("email") is correct
//       },
//       UpdateExpression:
//         "set userPlan = :userPlan, expiresIn = :expiresIn, referenceID = :referenceID",
//       ExpressionAttributeValues: {
//         ":userPlan": userPlan,
//         ":expiresIn": THIRTYDAYS,
//         ":referenceID": subscription.id,
//       },
//       ReturnValues: ReturnValue.UPDATED_NEW,
//     };
//
//     // Update the Users table with the subscription ID and plan details
//     await dynamoDB.send(new UpdateCommand(updateParams));
//
//     // Respond with the subscription details
//     // res.status(200).send({
//     //   subscriptionId: subscription.id,
//     //   clientSecret: paymentIntent.client_secret,  // Access paymentIntent here
//     //   paymentIntentStatus: paymentIntent.status,
//     // });
//     res.status(200).send({
//       subscriptionId: subscription.id,
//       clientSecret: '',  // Access paymentIntent here
//       paymentIntentStatus: 'success',
//     });
//   } catch (error) {
//     return next(
//       new AppError(
//         "Internal server error",
//         500,
//         (error as Error).message + " Please try again later",
//         true
//       )
//     );
//   }
// };
