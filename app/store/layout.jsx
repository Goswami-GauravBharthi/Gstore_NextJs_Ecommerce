import StoreLayout from "@/components/store/StoreLayout";
import { SignIn, SignedOut, SignedIn } from "@clerk/nextjs";

export const metadata = {
    title: "Gstore. - Store Dashboard",
    description: "Gstore. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>


            {/* if user logged in then they can see this layout */}
            <SignedIn>
                <StoreLayout>
                    {children}
                </StoreLayout>
            </SignedIn>

            {/* other wise they see the logggin ui */}
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/store" routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}
