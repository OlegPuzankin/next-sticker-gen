import { StickerType } from "../redux/interfaces";
import { Layout } from "../components/Layout";
import { StickerListItem } from "./StickerListItem";
import React from "react";
import { Loader } from "./UI/Loader";
import { LoadMoreButton } from "./LoadMoreButton";
import { SearchBox } from "./SearchBox";
import { QuickEditPopup } from "./QuickEditPopup";
import { UserContext } from "./UserProvider";
import { useDispatch, useSelector } from "react-redux";
import { SetQuickEditSticker } from "../redux/actions";

interface Props {
  loading: boolean;
  stickers: Array<StickerType>;
  loadMoreStickers: () => Promise<void>;
  lastVisibleId?: string;
  error?: string;
}

export function StickersCatalog({
  loading,
  stickers,
  lastVisibleId,
  loadMoreStickers,
}: Props) {
  const dispatch = useDispatch();

  const { user } = React.useContext(UserContext);
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  function quickEditSticker(sticker: StickerType) {
    dispatch(SetQuickEditSticker(sticker));
    setShowPopup(true);
  }

  return (
    <Layout title={"catalog"}>
      {loading && <Loader />}

      <SearchBox />

      {!loading && stickers?.length === 0 ? (
        <h2 className="text-center">No stickers found</h2>
      ) : (
        stickers?.map((st) => {
          return (
            <StickerListItem
              user={user}
              quickEdit={() => quickEditSticker(st)}
              sticker={st}
              key={st.id}
            />
          );
        })
      )}
      {/* LOAD MORE STICKERS BUTTON */}
      {lastVisibleId && <LoadMoreButton onClickHandler={loadMoreStickers} />}

      {/*POPUP QUICK EDIT STICKER MODAL WINDOW  */}
      {showPopup && (
        <QuickEditPopup
          // sticker={editSticker}
          closeHandler={() => setShowPopup(false)}
        />
      )}
    </Layout>
  );
}
