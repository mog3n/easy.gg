import Image from 'next/image'
import styled from 'styled-components'

export const Header = (props: any) => {
    return <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', flex:1, maxWidth: '1200px', justifyContent: 'space-between', alignItems: 'center'}}>
            <Image src="/logo.svg" height={89} width={69} alt="Logo" />
            <a href="https://discord.com/invite/P8kdG7XD5M"><Image src="/joinbetatest.svg" height={54} width={181} alt="Logo" /></a>
        </div>
    </div>
}