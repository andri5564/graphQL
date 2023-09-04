const loginPage = document.getElementById("loginSection");
const mainPage = document.getElementById("mainView");

document.getElementById("loginButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const userNameElem = document.getElementById("username");
  const passwordElem = document.getElementById("password");
  const username = userNameElem.value;
  const password = passwordElem.value;
  const authinfo = btoa(username + ":" + password);

  const response = await fetch("https://01.kood.tech/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: "Basic " + authinfo,
    },
  });
  const responseData = await response.json();

  if (response.ok) {
    JSWToken = responseData;
    userNameElem.value = "";
    passwordElem.value = "";
    setupMainViewData(JSWToken);
    mainView();
  } else {
    alert(responseData["error"]);
  }
});

document.getElementById("logoutButton").addEventListener("click", () => {
  loginView();
});

function mainView() {
  loginPage.style.display = "none";
  mainPage.style.display = "block";
}

function loginView() {
  mainPage.style.display = "none";
  loginPage.style.display = "block";
}

// mainView();

async function setupMainViewData(JSWToken) {
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${JSWToken}`,
  };
  setupUserInfo(headers);
  setupProjectsGraph(headers);
  setupTasksPieChart(headers);
}

async function setupTasksPieChart(headers) {
  const transactions = await getTransactions(headers);
  makePieChart(transactions);
  makeXPPieChart(transactions);
}

async function setupUserInfo(headers) {
  const userQuery = `{
        user {
          id
          login
          campus
          attrs
          transactions {
            amount
              type
              path
          }
        }
      }`;

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query: userQuery }),
  };

  const apiResponse = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", requestOptions);
  const apiData = await apiResponse.json();
  const user = apiData.data.user[0];
  const transactions = user.transactions;
  document.getElementById("userInfo1").innerHTML = user.login;
  document.getElementById("userInfo2").innerHTML = user.id;
  document.getElementById("userInfo3").innerHTML = user.campus;
  document.getElementById("userInfo4").innerHTML = getDiv1XP(transactions) + " kB";
  document.getElementById("userInfo5").innerHTML = user.attrs.country;
  document.getElementById("userInfo6").innerHTML = await getTimesCaptainCount(headers, user.id);
  document.getElementById("userInfo7").innerHTML = await getAuditsDone(headers, user.id);
}

async function setupProjectsGraph(headers) {
  const transactions = await getTransactions(headers);
  makeGraph(transactions);
}

async function getAuditsDone(headers, userId) {
  const userQuery = `
  {
    audit(where: { auditorId: { _eq: ${userId} }}) {
      id
      groupId
      auditorId
      grade
    }
  }
`;

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query: userQuery }),
  };

  const apiResponse = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", requestOptions);
  const apiData = await apiResponse.json();
  const auditArr = apiData.data.audit;
  let count = 0;
  auditArr.forEach((audit) => {
    if (audit.grade != null) {
      count++;
    }
  });
  console.log(count);
  return count;
}

function getDiv1XP(transactions) {
  let XPsum = 0;
  transactions.forEach((elem) => {
    if (elem.type == "xp" && !elem.path.includes("piscine")) {
      XPsum += elem.amount;
    }
  });
  return Math.round(XPsum / 1000);
}

async function getTransactions(headers) {
  const userQuery = `
    {
            transaction {
              amount
              type
              path
            }
          }
    `;

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query: userQuery }),
  };

  const apiResponse = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", requestOptions);
  const apiData = await apiResponse.json();
  const transactions = apiData.data.transaction;
  return transactions;
}

async function getTimesCaptainCount(headers, userID) {
  const userQuery = `
{
    group(where: { captainId: { _eq: ${userID} }}) {
      path
    }
  }
`;
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query: userQuery }),
  };
  const apiResponse = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", requestOptions);
  const apiData = await apiResponse.json();
  return apiData.data.group.length;
}

function getDoneTasks(transactions) {
  const matches = [];
  transactions.forEach((elem) => {
    if (elem.type == "xp" && !elem.path.includes("piscine")) {
      matches.push(elem);
    }
  });
  return matches;
}
