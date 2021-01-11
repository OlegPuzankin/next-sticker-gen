import React from "react";
import { NavLink } from "./ActiveLink";
import { UserContext } from "./UserProvider";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../redux/reducers";
import { fbInstance } from "../firebase/firebase";
import { saveToWord } from "../utils/saveDocx";
import { ResetStickers } from "../redux/actions";
import Link from "next/link";

export const Navbar = () => {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const stickersBundle = useSelector(
    (state: StoreState) => state.stickers.stickersBundle
  );
  const dispatch = useDispatch();

  async function logout() {
    await fbInstance.logout();
    dispatch(ResetStickers());
    router.push("/");
  }

  return (
    <div className="navigation bg-light">
      <NavLink
        href="/stickers?queryType=getRecent"
        defaultClassName={"nav-link font-weight-bold"}
        linkName={"CATALOG"}
      />
      <NavLink
        href="/create"
        defaultClassName={"nav-link font-weight-bold"}
        linkName={"CREATE NEW"}
      />
      {user?.admin && (
        <NavLink
          href="/dashboard/geo"
          defaultClassName={"nav-item nav-link font-weight-bold"}
          linkName={"DASHBOARD"}
        />
      )}

      {/* {stickersBundle?.length > 0 && (
        <button
          onClick={() => saveToWord(stickersBundle)}
          type="button"
          className="btn btn-primary"
        >
          Export to Word
          <span className="ml-2 badge badge-warning">
            {stickersBundle.length}
          </span>
        </button>
      )} */}

      {user && (
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Profile
          </button>
          <div className="dropdown-menu">
            <div className="dropdown-item cursor-pointer" onClick={logout}>
              Logout
            </div>

            <Link href="/profile">
              <a className="dropdown-item">User profile</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
