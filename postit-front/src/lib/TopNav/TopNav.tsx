"use client"

import { useDrawer } from '@/store';
import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { List, XCircle } from 'react-bootstrap-icons';

const TopNav = () => {
    const setMenuState = useDrawer((state) => state.toggleDrawer);
    const menuState = useDrawer((state) => state.drawerState);

    return (
        <Nav className='p-2 pl-4 bg-gray-800 flex'>
              <Nav.Item>
                <Button className='mr-5' onClick={setMenuState}>
                    {!menuState ? (<List color='white' size={24} />) : (<XCircle color='white' size={24} />)}
                </Button>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/" className='text-teal-500'>Post-IT</Nav.Link>
            </Nav.Item>
        </Nav>
    )
};

export default TopNav;