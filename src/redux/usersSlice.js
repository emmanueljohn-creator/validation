import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: JSON.parse(localStorage.getItem("users")) || [],

  reducers: {
    transferFunds: (state, action) => {
      const {
        userID,
        senderAccountID,
        recipientAccountNumber,
        recipientID,
        amount,
        memo,
      } = action.payload;

      const sender = state.find((user) => user.id === userID);

      if (!sender) {
        alert("Sender not found");
        return;
      }

      const senderAccount = sender.accounts.find(
        (account) => account.id === senderAccountID,
      );

      if (!senderAccount) {
        alert("Sender account not found");
        return;
      }

      if (senderAccount.balance < amount) {
        alert("Insufficient balance");
        return;
      }

      const recipient = state.find((user) =>
        user.accounts.some(
          (account) => account.accountNumber === recipientAccountNumber,
        ),
      );

      if (!recipient) {
        alert("Recipient not found");
        return;
      }

      const recipientAccount = recipient.accounts.find(
        (account) => account.accountNumber === recipientAccountNumber,
      );

      if (!recipientAccount) {
        alert("Recipient account not found");
        return;
      }

      senderAccount.balance -= amount;
      recipientAccount.balance += amount;

      sender.transactions.push({
        id: Date.now(),
        type: "debit",
        amount,
        memo,
        date: new Date().toISOString(),
      });

      recipient.transactions.push({
        id: Date.now(),
        type: "credit",
        amount,
        memo,
        date: new Date().toISOString(),
      });


      localStorage.setItem("users", JSON.stringify(state));

      alert("Funds transferred successfully");
    },

    createuser: (state, action) => {
      const { fullName, email, password, accountNumber } = action.payload;

      const NewUser = {
        id: Date.now(),
        fullName,
        email,
        password,

        accounts: [
          {
            id: 1,
            name: "Main Account",
            accountNumber,
            balance: 5000000,
          },
        ],

        transactions: [],
      };

      state.push(NewUser);

      localStorage.setItem("users", JSON.stringify(state));
    },

    loginUser: (state, action) => {
      const { email, password } = action.payload;

      const user = state.find((user) => user.email === email);

      if (!user) {
        alert("User not found");
        return;
      }

      if (user.password !== password) {
        alert("Incorrect password");
        return;
      }

      user.isLoggedIn = true;

      alert("Login successful");

      localStorage.setItem("users", JSON.stringify(state));
    },
  },
});

export const { transferFunds, createuser, loginUser } = usersSlice.actions;

export default usersSlice.reducer;