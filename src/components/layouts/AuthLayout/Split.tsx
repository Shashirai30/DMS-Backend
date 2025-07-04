import { cloneElement } from 'react'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { APP_NAME } from '@/constants/app.constant'


interface SplitProps extends CommonProps {
    content?: ReactNode
}

const Split = ({ children, content, ...rest }: SplitProps) => {
    return (
        <div className="grid lg:grid-cols-2 h-full p-6 bg-white dark:bg-gray-800">
            <div className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-center items-center hidden lg:flex  border via-black rounded-3xl">
                <div className="flex flex-col items-center gap-12">
                    <img
                        className="max-w-[500px] 2xl:max-w-[900px] "
                        src="/img/others/auth-split-img.png"


                        aria-label={`${APP_NAME} logo animation`}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '8px',
                            objectFit: 'contain',
                        }}
                    />
                    <div className="text-center max-w-[550px]">
                        <h1 className="text-black">
                            Document Management System (DMS)
                        </h1>
                        <p className="text-black opacity-80 mx-auto mt-8 font-semibold">
                            Document management software helps the enforcement of your organization’s
                            record management policies. At the same time,
                            it allows you to conveniently store, obtain, and share diverse data related to the various business processes in your organization.
                        </p>
                    </div>

                </div>
            </div>
            <div className="flex flex-col justify-center items-center ">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px] shadow-lg p-6">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                            ...rest,
                        })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Split
