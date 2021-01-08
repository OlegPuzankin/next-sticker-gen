import React from 'react';
import { NavLink } from './ActiveLink';

export const DashboardNavs = (props) => {



    return (
        <div className="dashboard-navs">
            <NavLink href='/dashboard/geo' defaultClassName={'nav-item nav-link font-weight-bold'} linkName={'Edit geography'} />
            <NavLink href='/dashboard/producers' defaultClassName={'nav-item nav-link font-weight-bold'} linkName={'Edit producers'} />
            <NavLink href='/dashboard/grapes' defaultClassName={'nav-item nav-link font-weight-bold'} linkName={'Edit grapes'} />
        </div>
    )
};

