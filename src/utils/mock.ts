import isOnline from "is-online";

export async function shouldMock(req?: Request) {
  if (req) {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("mock")) {
      return true;
    }
  }

  const online = await isOnline();

  if (!online) {
    return true;
  }

  return false;
}
