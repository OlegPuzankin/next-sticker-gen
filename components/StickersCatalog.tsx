import { StickerType } from "../redux/interfaces"
import { Layout } from "../components/Layout"
import { StickerListItem } from "./StickerListItem"
import React from "react"
import { Loader } from "./UI/Loader"
import { LoadMoreButton } from "./LoadMoreButton"
import { SearchBox } from "./SearchBox"
import { QuickEditPopup } from "./QuickEditPopup"
import { UserContext } from "./UserProvider"
import { useDispatch, useSelector } from "react-redux"
import { SetQuickEditSticker } from "../redux/actions"
import { StoreState } from "../redux/reducers"
import { saveToWord } from "../utils/saveDocx"

interface Props {
  loading: boolean
  setLoading: Function
  stickers: Array<StickerType>
  loadMoreStickers: () => Promise<void>
  lastVisibleId?: string
  error?: string
}

export function StickersCatalog({
  loading,
  setLoading,
  stickers,
  lastVisibleId,
  loadMoreStickers,
}: Props) {
  const dispatch = useDispatch()
  const stickersBundle = useSelector(
    (state: StoreState) => state.stickers.stickersBundle
  )

  const { user } = React.useContext(UserContext)
  const [showPopup, setShowPopup] = React.useState<boolean>(false)

  function quickEditSticker(sticker: StickerType) {
    dispatch(SetQuickEditSticker(sticker))
    setShowPopup(true)
  }
  async function exportToDOCX() {
    setLoading(true)
    await saveToWord(stickersBundle)
    setLoading(false)
  }

  return (
    <Layout title={"catalog"}>
      {loading && <Loader />}

      <div className="search-container">
        <SearchBox />

        {stickersBundle?.length > 0 && (
          <button
            id="export_word"
            onClick={exportToDOCX.bind(null, stickersBundle)}
            type="button"
            className="btn btn-primary"
          >
            Export to Word
            <span className="ml-2 badge badge-warning">
              {stickersBundle.length}
            </span>
          </button>
        )}
      </div>

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
          )
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
  )
}
