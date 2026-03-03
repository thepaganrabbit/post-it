"use client";
import { useDrawer } from "@/store";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Archive, Journal, ListTask, QuestionDiamond, Stickies } from "react-bootstrap-icons";
import "./Drawer.style.scss";
import { useRouter } from "next/navigation";

const Drawer = () => {
  const [mounted, setMounted] = useState(false);
  const drawerState = useDrawer((state) => state.drawerState);
  const setDrawerState = useDrawer((state) => state.toggleDrawer);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    drawerState && (
      <Container className="flex">
        <div
          className="
            menu-box    
            bg-gray-900
            w-60           
            p-2
            pt-4
            min-h-screen
            drawer-container
    "
        >
          <h1 className="text-white mb-5" style={{ textAlign: "center" }}>
            Drawer
          </h1>

          <div
            className="
      menu-items
      flex            
      flex-col        
      items-center    
      justify-center  
      mt-5
      space-y-4       
    "
          >
            <Button
              className="mt-2 mb-2"
              onClick={() => {
                router.push("/");
                setDrawerState();
              }}
            >
              <Stickies color="white" size={24} />
            </Button>

            <Button
              className="mt-2 mb-2"
              onClick={() => {
                router.push("/in-progress");
                setDrawerState();
              }}
            >
              <ListTask color="white" size={24} />
            </Button>
            <Button
              className="mt-2 mb-2"
              onClick={() => {
                router.push("/archive");
                setDrawerState();
              }}
            >
              <Archive color="white" size={24} />
            </Button>
            <Button
              className="mt-2 mb-2"
              onClick={() => {
                router.push("/faqs");
                setDrawerState();
              }}
            >
              <QuestionDiamond color="white" size={24} />
            </Button>
            <Button
              className="mt-2 mb-2"
              onClick={() => {
                router.push("/notes");
                setDrawerState();
              }}
            >
              <Journal color="white" size={24} />
            </Button>
          </div>
        </div>
        <div className="backdrop" onClick={setDrawerState} />
      </Container>
    )
  );
};

export default Drawer;
