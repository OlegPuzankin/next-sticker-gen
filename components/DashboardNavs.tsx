import React from "react"
import { NavLink } from "./ActiveLink"

export const DashboardNavs = (props) => {
  return (
    <div className="dashboard-navs px-3 py-2">
      <NavLink
        href="/dashboard/geo"
        defaultClassName={"font-weight-bold pr-3"}
        linkName={"Edit geography"}
      />
      <NavLink
        href="/dashboard/producers"
        defaultClassName={"font-weight-bold pr-3"}
        linkName={"Edit producers"}
      />
      <NavLink
        href="/dashboard/grapes"
        defaultClassName={"font-weight-bold"}
        linkName={"Edit grapes"}
      />
    </div>
  )
}
