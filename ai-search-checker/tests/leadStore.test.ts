import { describe, it, expect } from "vitest";
import { GoogleFormLeadStore } from "../lib/db/googleFormLeadStore";

describe("GoogleFormLeadStore", () => {
  const prefill =
    "https://docs.google.com/forms/d/e/ABC123/viewform?usp=pp_url" +
    "&entry.111=__COMPANY__&entry.222=__EMAIL__&entry.333=__URL__" +
    "&entry.444=__SCORE__&entry.555=__GRADE__";

  it("事前入力URLから設問IDを解析し、送信先URLを /formResponse にする", () => {
    const store = new GoogleFormLeadStore(prefill) as unknown as {
      responseUrl: string;
      entryMap: Record<string, string>;
    };
    expect(store.responseUrl).toBe(
      "https://docs.google.com/forms/d/e/ABC123/formResponse"
    );
    expect(store.entryMap.company).toBe("entry.111");
    expect(store.entryMap.email).toBe("entry.222");
    expect(store.entryMap.url).toBe("entry.333");
    expect(store.entryMap.score).toBe("entry.444");
    expect(store.entryMap.grade).toBe("entry.555");
  });

  it("マーカーが無いURLはエラーになる", () => {
    expect(
      () =>
        new GoogleFormLeadStore(
          "https://docs.google.com/forms/d/e/ABC123/viewform?usp=pp_url"
        )
    ).toThrow();
  });
});
