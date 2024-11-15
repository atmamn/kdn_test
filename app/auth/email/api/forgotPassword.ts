import express, { Request, Response, NextFunction } from "express";
import { AppError } from "../../../../lib/error";
import { generateRandomNumbers } from "../../../../utils/app/otpRandomNumbers";
import { PLUSTHIRTYMINUTES } from "../../../../lib/constants/dates";
import { sendOtpEmail } from "../../../../lib/nodemailer/services/otpMsg";
import { dynamoDB } from "../../../../db/dal";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { usersTableQueryParams } from "../../../../utils/app/usersQueryParams";
export const forgotPassword: express.RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email }: { email: string } = req.body;

  if (!email) {
    return next(new AppError("Unauthorized", 401, "No email provided", true));
  }

  const randomNumbers = generateRandomNumbers();

  const putParams = {
    TableName: "OTPs",
    Item: {
      email: email,
      code: randomNumbers,
      timestamp: PLUSTHIRTYMINUTES,
      verified: false,
    },
  };

  try {
    const queryParams = usersTableQueryParams(email);

    const result = await dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return next(
        new AppError(
          "Invalid credentials",
          404,
          "If your account exists, an OTP email has been sent.",
          true
        )
      );
    }

    await sendOtpEmail(email, randomNumbers);

    await dynamoDB.send(new PutCommand(putParams));

    res.status(200).json({ status: "success", message: "OTP sent" });
  } catch (error) {
    return next(
      new AppError(
        "Internal server error",
        500,
        (error as Error).message + " Please try again later",
        true
      )
    );
  }
};
