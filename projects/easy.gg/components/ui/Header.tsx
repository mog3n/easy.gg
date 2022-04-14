import Image from 'next/image'
import styled from 'styled-components'
import { AppNavBar } from 'baseui/app-nav-bar';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { app } from '../../pages/_app';
import { useAuth } from '../hooks/useAuth';
import { toaster } from 'baseui/toast';
import { useSetRecoilState } from 'recoil';
import { signInModalVisibleState } from '../../state/atoms/ui';
import Link from 'next/link';

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`
const HeaderItems = styled.div`
    display: flex;
    flex: 1;
    max-width: 1200px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 600px) {
        padding-left: 20px;
    }
`

const HeaderLogo = styled.img`
    cursor: pointer;
    width: 58px;
    @media (max-width: 600px) {
        width: 52px;
        margin: 0;
    }
`
const BetaTestButton = styled.img`
    display: block;
    width: 181px;
    @media (max-width: 600px) {
        width: 160px;
    }
`

const MainItems = {
    Home: "Home",
    Create: "Create",
    Editor: "Editor",
    Library: "Library",
    Login: "Login",
    Import: "Import"
}
const UserItems = {
    Settings: "Account Settings",
    SignOut: "Sign Out"
}
const userProfilePhrases = ["Gamer since time", "Welcome back!", "Gamer since birth", "Spike planted!", "Ace!"];
interface HeaderProps {
    pageActive?: "Home" | "Editor" | "Library" | "Login" | "Import" | "Create"
}

export const Header = (props: HeaderProps) => {
    const auth = useAuth();
    const router = useRouter();

    const setSignInModalVisible = useSetRecoilState(signInModalVisibleState);
    const user = auth.user

    const isMainItemActive = (name: string) => {
        return (name === props.pageActive)
    }

    if (user) {
        return <>
            <AppNavBar
                title="EZ GG"
                mainItems={[
                    // { label: MainItems.Home, active: isMainItemActive(MainItems.Home) },
                    // { label: MainItems.Create, active: isMainItemActive(MainItems.Create) },
                    // { label: MainItems.Editor, active: isMainItemActive(MainItems.Editor) },
                    // { label: MainItems.Import, active: isMainItemActive(MainItems.Import) }
                ]}
                userImgUrl="/assets/userprofile2.jpg"
                username={user.phoneNumber || 'User'}
                usernameSubtitle={userProfilePhrases[Math.round(Math.random()*userProfilePhrases.length)]}
                userItems={[
                    { label: UserItems.Settings },
                    { label: UserItems.SignOut }
                ]}
                onUserItemSelect={(item) => {
                    switch (item.label) {
                        case UserItems.Settings:
                            break;
                        case UserItems.SignOut:
                            // Sign Out
                            auth.firebaseAuth.signOut().then(() => {
                                toaster.info(<>Signed out</>, {autoHideDuration: 5000})
                            })
                            break;
                        default:
                            break;
                    }
                }}
                onMainItemSelect={(item) => {
                    switch(item.label) {
                        case MainItems.Home:
                            // Account Settings
                            router.push('/');
                            break;
                        case MainItems.Create:
                            router.push('/selectSource');
                            break;
                        case MainItems.Editor:
                            router.push('/edit');
                            break;
                        case MainItems.Import:
                            router.push('/import');
                            break;
                        case MainItems.Login:
                            setSignInModalVisible(true);
                            break;
                        default:
                            break;
                    }
                }}
                overrides={{
                    AppName: {
                        component: () => <Link href="/" passHref><HeaderLogo src="/logo.svg" alt="Logo" /></Link>
                    },
                }}
            />
        </>
    }

    // Unauthed header
    return <>
        <AppNavBar
            title="EZ GG"
            mainItems={[
                // { label: MainItems.Home, active: isMainItemActive(MainItems.Home) },
                // { label: MainItems.Create, active: isMainItemActive(MainItems.Create) },
                // { label: MainItems.Editor, active: isMainItemActive(MainItems.Editor) },
                // { label: MainItems.Import, active: isMainItemActive(MainItems.Import) },
                { label: MainItems.Login }
            ]}
            onMainItemSelect={(item) => {
                switch(item.label) {
                    case MainItems.Home:
                        // Account Settings
                        router.push('/');
                        break;
                    case MainItems.Create:
                        router.push('/selectSource');
                        break;
                    case MainItems.Editor:
                        router.push('/edit');
                        break;
                    case MainItems.Import:
                        router.push('/import');
                        break;
                    case MainItems.Login:
                        setSignInModalVisible(true);
                        break;
                    default:
                        break;
                }
            }}
            overrides={{
                AppName: {
                    component: () => <HeaderLogo src="/logo.svg" alt="Logo" onClick={() => router.push('/')} />
                }
            }}
        />
    </>
}