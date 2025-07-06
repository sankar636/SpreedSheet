import { Fragment } from "react";
import { Button } from "../../../Components/Button"
import type { JSX } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "../../../Components/Breadcrumb"

export const NavBar = (): JSX.Element => {

    const breadcrumbItems = [
        { label: "Workspace", href: "#", active: false },
        { label: "Folder 2", href: "#", active: false },
        { label: "Spreadsheet 3", href: "#", active: true },
    ];

    const handleButtonClick = (action: string, data?: unknown) => {
        console.log(`Navigation button clicked: ${action}`, data);
    };

    return (
        <header className="flex items-center justify-between px-4 py-2 relative self-stretch w-full flex-[0_0_auto] z-[3] bg-white border-b [border-bottom-style:solid] border-[#eeeeee]">
            <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 h-6 w-6"
                    onClick={() => handleButtonClick("panel")}
                >
                    <img
                        className="w-6 h-6"
                        alt="Panel"
                        src="https://c.animaapp.com/mclmkdkf288FZk/img/panel.svg"
                    />
                </Button>

                <Breadcrumb>
                    <BreadcrumbList className="inline-flex items-center gap-1">
                        {breadcrumbItems.map((item, index) => (
                            <Fragment key={index}>
                                {index > 0 && (
                                    <BreadcrumbSeparator>
                                        <img
                                            className="w-3 h-3"
                                            alt="Chevron"
                                            src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron-1.svg"
                                        />
                                    </BreadcrumbSeparator>
                                )}
                                <BreadcrumbItem>                    <BreadcrumbLink
                                    href={item.href}
                                    className={`inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] ${item.active ? "" : "hover:text-[#121212]"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleButtonClick("breadcrumb", item);
                                    }}
                                >
                                    <span
                                        className={`relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] ${item.active ? "text-[#121212]" : "text-[#afafaf]"
                                            } text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]`}
                                    >
                                        {item.label}
                                    </span>                      {item.active && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-6 h-6 p-0 justify-center gap-2 rounded flex items-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleButtonClick("more", item);
                                            }}
                                        >
                                            <img
                                                className="w-5 h-5"
                                                alt="More"
                                                src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg"
                                            />
                                        </Button>
                                    )}
                                </BreadcrumbLink>
                                </BreadcrumbItem>
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
};