import { createStore } from "redux";

type Reducer<State, Action> = (state: State | any, action: Action) => State;

const initialState = {
  messages: [],
};

const chatApp: Reducer<
  { messages: [] },
  { type: string; name?: string; message?: string; index?: number }
> = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return Object.assign({}, state, {
        messages: [
          ...state!.messages,
          {
            name: action.name,
            message: action.message,
            show: true,
          },
        ],
      });
    case "HIDE_MESSAGE":
      if (action.index != undefined) {
        state.messages[action.index].show = false;
      }
    default:
      return state;
  }
};
const store = createStore(chatApp);

const config = {
  firebaseBaseUrl: "https://otus-js-chat-4ed79-default-rtdb.firebaseio.com",
  firebaseCollection: "messages.json",
};

async function getMessagesList() {
  return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(
      (data: {
        el: { date: string; message: string; name: string; nickname?: string };
      }) =>
        Object.values(data).map((el) => ({
          ...el,
          date: new Date(el.date),
        }))
    );
}

async function sendMessage(data: { name: string; message: string }) {
  const actionAdd = {
    type: "ADD_MESSAGE",
    name: data.name,
    message: data.message,
  };

  store.dispatch(actionAdd);

  const actionHide = {
    type: "HIDE_MESSAGE",
    index: store.getState().messages.length - 6,
  };

  store.dispatch(actionHide);

  return fetch(`${config.firebaseBaseUrl}/${config.firebaseCollection}`, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      date: new Date(),
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

const body = document.querySelector("body");

const inputNickname = document.createElement("input");
const inputMessage = document.createElement("input");
const button = document.createElement("button");

let arrOfSmiles = [
  "&#128515;",
  "&#128513;",
  "&#128514;",
  "&#128540;",
  "&#128529;",
];

body?.append(document.createElement("p"));
body?.append(inputNickname);
body?.append(document.createElement("p"));

for (let i = 0; i < 5; i += 1) {
  const smile = document.createElement("div");
  smile.classList.add("smiles");
  body?.append(smile);
  smile.innerHTML = arrOfSmiles[i];

  smile.addEventListener("click", () => {
    inputMessage.value += smile.innerHTML;
  });
}

body?.append(inputMessage);
body?.append(button);

document.querySelectorAll("p")[0].innerHTML = "nickname: ";
document.querySelectorAll("p")[1].innerHTML = "message: ";
button.innerHTML = "send";

function addMessage() {
  for (let y = 0; y < 5; y += 1) {
    const action = {
      type: "ADD_MESSAGE",
      name: document.querySelectorAll(".name")[y].innerHTML,
      message: document.querySelectorAll(".text")[y].innerHTML,
    };

    store.dispatch(action);
  }
  console.log(store.getState());
}

getMessagesList().then((res) => {
  //console.log(res)
  for (let i = res.length - 5; i <= res.length - 1; i += 1) {
    const messageWrapper = document.createElement("div");
    const nickname = document.createElement("p");
    const message = document.createElement("p");

    messageWrapper.classList.add("message");
    nickname.classList.add("name");
    message.classList.add("text");

    body?.append(messageWrapper);
    messageWrapper?.append(nickname);
    messageWrapper?.append(message);

    nickname.innerHTML = `nickname: ${res[i].name}`;
    message.innerHTML = `message: ${res[i].message}`;
  }
  addMessage();
});

button?.addEventListener("click", () => {
  sendMessage({
    name: `${inputNickname.value}`,
    message: `${inputMessage.value}`,
  });

  document.querySelectorAll(".message").forEach((e) => e.remove());

  getMessagesList().then((res) => {
    for (let i = res.length - 5; i <= res.length - 1; i += 1) {
      const messageWrapper = document.createElement("div");
      const nickName = document.createElement("p");
      const message = document.createElement("p");

      messageWrapper.classList.add("message");

      body?.append(messageWrapper);
      messageWrapper?.append(nickName);
      messageWrapper?.append(message);

      if (res[i].nickname === undefined) {
        nickName.innerHTML = `nickname: ${res[i].name}`;
      } else {
        nickName.innerHTML = `nickname: ${res[i].nickname}`;
      }

      message.innerHTML = `message: ${res[i].message}`;
    }
    console.log(store.getState());
  });
});
