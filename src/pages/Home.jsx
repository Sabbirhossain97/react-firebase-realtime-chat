import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

const authTabs = [
    {
        name: 'Signin',
        component: () => <Login />
    },
    {
        name: 'Signup',
        component: () => <Signup />
    },
];

function Home() {
    return (
        <div className="bg-slate-900 w-full min-h-screen flex flex-col items-center justify-center">
            <TabGroup className="w-full max-w-lg px-6 py-8">
                    <TabList className="text-center">
                        {authTabs.map(({ name }) => (
                            <Tab
                                key={name}
                                className="rounded-md text-xl text-center whitespace-nowrap cursor-pointer transition duration-300 ease-in-out px-8 sm:px-8 py-1 text-white font-semibold data-selected:text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-selected:bg-sky-400 dark:data-selected:bg-white/10 dark:data-selected:data-hover:bg-white/10"
                            >
                                {name}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-3">
                        {authTabs.map(({ component }, index) => (
                            <TabPanel key={index} className="rounded-xl py-3">
                                {component}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
        </div>
    )
}

export default Home