import {
  getMessagesList,
  firstFiveMessages,
  store,
  buttonFunc,
  sendMessage,
} from "./reduxChat";

describe("redux chat", () => {
  it("first five messages", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { message: "9999", name: "IVAN" },
              { message: "Hey!😁", name: "Liza" },
              { message: "Hi", name: "Joe" },
              { message: "hkjkjj", name: "Olga" },
              { message: "LOL", name: "Mike" },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { message: "9999", name: "IVAN" },
              { message: "Hey!😁", name: "Liza" },
              { message: "Hi", name: "Joe" },
              { message: "hkjkjj", name: "Olga" },
              { message: "LOL", name: "Mike" },
            ]),
        })
      );

    const fireBaseMessages = await getMessagesList();
    await firstFiveMessages();

    const nicks = document.querySelectorAll(".name");
    const messages = document.querySelectorAll(".text");

    expect(nicks[0].innerHTML).toBe(fireBaseMessages[0].name);
    expect(nicks[2].innerHTML).toBe(fireBaseMessages[2].name);
    expect(nicks[4].innerHTML).toBe(fireBaseMessages[4].name);

    expect(messages[0].innerHTML).toBe(fireBaseMessages[0].message);
    expect(messages[2].innerHTML).toBe(fireBaseMessages[2].message);
    expect(messages[4].innerHTML).toBe(fireBaseMessages[4].message);

    type Store = {
      messages: { message: string; name: string; show: boolean }[];
    };

    const reduxMessages: Store = store.getState();

    expect(reduxMessages.messages[0].name).toBe(nicks[0].innerHTML);
    expect(reduxMessages.messages[2].name).toBe(nicks[2].innerHTML);
    expect(reduxMessages.messages[4].name).toBe(nicks[4].innerHTML);

    expect(reduxMessages.messages[0].message).toBe(messages[0].innerHTML);
    expect(reduxMessages.messages[2].message).toBe(messages[2].innerHTML);
    expect(reduxMessages.messages[4].message).toBe(messages[4].innerHTML);

    expect(reduxMessages.messages[0].show).toBe(true);
    expect(reduxMessages.messages[4].show).toBe(true);
  });

  it("send message", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({}),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { message: "9999", name: "IVAN" },
              { message: "Hey!😁", name: "Liza" },
              { message: "Hi", name: "Joe" },
              { message: "hkjkjj", name: "Olga" },
              { message: "LOL", name: "Mike" },
              { message: "Suuuuperr!!!", name: "Franky" },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { message: "9999", name: "IVAN" },
              { message: "Hey!😁", name: "Liza" },
              { message: "Hi", name: "Joe" },
              { message: "hkjkjj", name: "Olga" },
              { message: "LOL", name: "Mike" },
              { message: "Suuuuperr!!!", name: "Franky" },
            ]),
        })
      );

    const inputName = document.querySelectorAll("input")[0];
    const inputMessage = document.querySelectorAll("input")[1];

    inputName.value = "Franky";
    inputMessage.value = "Suuuuperr!!!";

    await buttonFunc();
    const fireBaseMessages = await getMessagesList();

    const nicks = document.querySelectorAll(".name");
    const messages = document.querySelectorAll(".text");

    expect(nicks[0].innerHTML).not.toBe(fireBaseMessages[0].name);

    expect(nicks[0].innerHTML).toBe(fireBaseMessages[1].name);
    expect(nicks[2].innerHTML).toBe(fireBaseMessages[3].name);
    expect(nicks[4].innerHTML).toBe(fireBaseMessages[5].name);

    expect(messages[0].innerHTML).not.toBe(fireBaseMessages[0].messages);

    expect(messages[0].innerHTML).toBe(fireBaseMessages[1].message);
    expect(messages[2].innerHTML).toBe(fireBaseMessages[3].message);
    expect(messages[4].innerHTML).toBe(fireBaseMessages[5].message);

    type Store = {
      messages: { message: string; name: string; show: boolean }[];
    };

    const reduxMessages: Store = store.getState();

    expect(reduxMessages.messages[0].show).toBe(false);

    expect(reduxMessages.messages[5].name).toBe(nicks[4].innerHTML);
    expect(reduxMessages.messages[5].message).toBe(messages[4].innerHTML);
    expect(reduxMessages.messages[5].show).toBe(true);
  });

  it("smiles", () => {
    const inputMessage = document.querySelectorAll("input")[1];
    inputMessage.value = "";
    const smiles = document.querySelectorAll(
      ".smiles"
    ) as NodeListOf<HTMLDivElement>;

    smiles[0].click();
    expect(inputMessage.value).toBe(smiles[0].innerHTML);
    inputMessage.value = "";
    smiles[2].click();
    expect(inputMessage.value).toBe(smiles[2].innerHTML);
    inputMessage.value = "";
    smiles[4].click();
    expect(inputMessage.value).toBe(smiles[4].innerHTML);
  });
});
