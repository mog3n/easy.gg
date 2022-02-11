import Image from 'next/image'
import styled from 'styled-components'

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
    width: 69px;
    height: 60px;
    margin: 10px;
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

export const Header = (props: any) => {
    return <HeaderContainer>
        <HeaderItems>
            <HeaderLogo src="/logo.svg" alt="Logo" />
            <a href="https://discord.com/invite/P8kdG7XD5M">
                <BetaTestButton src="/joinbetatest.svg" alt="Join Beta Button"/>
            </a>
        </HeaderItems>
    </HeaderContainer>
}