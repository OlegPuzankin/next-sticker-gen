import Link from "next/link";
import { StoreState } from "../redux/reducers";
import { useSelector } from "react-redux";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";
import { saveToWord } from "../utils/saveDocx";
import { GetServerSideProps } from "next";
import { checkAuth } from "../utils/server-functions";
import React from "react";
import { UserContext } from "../components/UserProvider";

export default function Home() {
  const { user } = React.useContext(UserContext);

  const router = useRouter();
  const sticker = useSelector((state: StoreState) => state.stickers.stickers);

  return (
    <div className="home-page">
      <h3>Welcome to WineSticker Generator</h3>

      {user ? (
        <Link href={"/stickers/?queryType=getRecent"}>
          <a> Перейти в каталог &#8594;</a>
        </Link>
      ) : (
        <Link href="/auth">
          <a>Авторизуватися &#8594; </a>
        </Link>
      )}
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const user = await checkAuth(ctx)

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {}
//   }
// }
