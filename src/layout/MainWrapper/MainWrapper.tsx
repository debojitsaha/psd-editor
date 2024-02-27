import { MainWrapperProps } from "@/interface/layout";
import { MainWrapperContainer } from "../container";


export default function MainWrapper({ children }: MainWrapperProps) {
    return (
        <MainWrapperContainer>
            {children}
        </MainWrapperContainer>
    )
}