import { csv } from "d3-fetch";
export async function codes() {
  const data = await csv(
    "https://raw.githubusercontent.com/neocarto/geocountries/main/data/codes.csv"
  );
  return data;
}
