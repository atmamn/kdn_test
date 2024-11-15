// Users Table Query Params. Use of only partition & sort keys
export const usersTableQueryParams = (email: string) => ({
  TableName: "Users",
  KeyConditionExpression: "email = :email AND acc_type = :acc_type",
  ExpressionAttributeValues: {
    ":email": email,
    ":acc_type": "email",
  },
});
