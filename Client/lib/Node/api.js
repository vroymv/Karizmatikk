import { saveToken, getToken } from "../Storage";

export async function sendFormData(formData, route) {
  var status;

  try {
    const response = await fetch(
      `https://karizmatik-2b6bd67a5cc1.herokuapp.com/${route}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (err) {
    console.log(err);
  }
  return status;
}

export async function getOurWork(id) {
  var ourwork;
  var response;

  try {
    if (id) {
      response = await fetch(
        "https://karizmatik-2b6bd67a5cc1.herokuapp.com/ourwork",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }
      );
    } else {
      response = await fetch(
        "https://karizmatik-2b6bd67a5cc1.herokuapp.com/ourwork"
      );
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    ourwork = await response.json();
    return ourwork;
  } catch (err) {
    console.log(err);
  }
}

export async function getWishes() {
  var wishes;

  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/wishes"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    wishes = await response.json();
    return wishes;
  } catch (err) {
    console.log(err);
  }
}

export async function createAccount(formData) {
  var token;

  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    token = await response.json();
    saveToken(token.accessToken);
  } catch (err) {
    console.log(err);
  }
  return token;
}

//Find user by number
export async function findUser(searchParam, method) {
  var status;
  var userData = { searchParam: searchParam, method: method };

  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/finduser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (err) {
    console.log(err);
  }
  return status;
}

//Login
export async function login(formData) {
  var token;

  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    token = await response.json();
    if (token.accessToken) {
      saveToken(token.accessToken);
    }
    console.log(token);
  } catch (err) {
    console.log(err);
  }
  return token;
}

//RequestAuth
export async function requestAuth() {
  var token = await getToken();
  var user;

  try {
    if (token) {
      const response = await fetch(
        "https://karizmatik-2b6bd67a5cc1.herokuapp.com/auth",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      user = await response.json();
    } else {
      user = null;
    }
  } catch (err) {
    console.log(err);
  }
  return user;
}

//Place Order
export async function placeOrder(userInfo, order) {
  userInfo.order = order;
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/placeorder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();

    console.log("Order placed");
  } catch (error) {
    console.log(error);
  }
  return status;
}

//Pull Pending Orders
export async function getOrders(userId, route) {
  var orders;
  try {
    const response = await fetch(
      `https://karizmatik-2b6bd67a5cc1.herokuapp.com/${route}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    orders = await response.json();
  } catch (error) {
    console.log(error);
  }
  return orders;
}

//Update user
export async function updateUserData(userData) {
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/updateuserdata",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (error) {
    console.log(error);
  }
  return status;
}

//Pull Number Pending Orders
export async function getNumberOfPendingOrders(userId) {
  var orderNumber;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/numberpendingpickup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    orderNumber = await response.json();
  } catch (error) {
    console.log(error);
  }
  return orderNumber.numPendingOrders;
}

export async function updatepwd(phoneNumber, password) {
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/updatepwd",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tel: phoneNumber, password: password }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (error) {
    console.log(error);
  }
  return status;
}

export async function getMessages(userId) {
  var messages;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    messages = await response.json();
  } catch (error) {
    console.log(error);
  }
  return messages;
}

export async function postMessages(userMessage) {
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/postmessage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMessage),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (error) {
    console.log(error);
  }
  return status;
}

//Send push notification token to server
export async function sendPushToken(pushToken, id) {
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/pushtoken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pushToken: pushToken, id: id }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (error) {
    console.log(error);
  }
  return status;
}

//Mark messages  as read
export async function markAllRead(id) {
  var status;
  try {
    const response = await fetch(
      "https://karizmatik-2b6bd67a5cc1.herokuapp.com/markread",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    status = await response.json();
  } catch (error) {
    console.log(error);
  }
  return status;
}
