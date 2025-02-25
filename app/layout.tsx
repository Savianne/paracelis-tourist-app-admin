import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import StyledComponentsRegistry from "./components/styledComponentsRegistry";
import AuthProvider from "./context/AuthProvider";

//Componets
import SideBar from "./components/SideBar";
import TabLayoutContainer from "./components/TabLayoutContainer";
import NavBarMobile from "./components/MobileNavbar";
import Container from "./components/Container";
import MainContainer from "./components/MainContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paracelist tourist app Admin",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{display: "flex"}}>
          <StyledComponentsRegistry>
            <AuthProvider>
              <MainContainer>
                <NavBarMobile />
                <Container>
                  <SideBar />
                  <TabLayoutContainer>
                    {children}
                  </TabLayoutContainer>
                </Container>
              </MainContainer>
            </AuthProvider>
          </StyledComponentsRegistry>
        </div>
      </body>
    </html>
  );
}
