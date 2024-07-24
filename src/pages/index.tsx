import Features from "@/components/other/features";
import UseCases from "@/components/other/UseCases";
import { buttonVariants } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper";
import Testimonials from "@/components/ui/Testimonials";
import { ArrowRight, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-green-500/20 bg-gradient-to-r from-blue-500/30 to-green-500/30 px-7 py-2 shadow-md backdrop-blur-sm transition-all hover:border-green-500/40 hover:bg-gradient-to-r from-blue-500/40 to-green-500/40">
  <p className="text-sm font-semibold text-white">
    DocXpert is now Live!
  </p>
</div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          Chat with your <span className="text-white">documents</span> in
          seconds.
        </h1>
        <p className="mt-5 max-w-prose text-white sm:text-lg">
          DocXpert allows you to have conversations with any PDF document.
          Simply upload your file and start asking questions right away !
        </p>
        <Link
          href="/f"
          className={buttonVariants({
            variant: "gradient",
            size: "lg",
            className: "mt-5 bg-green-500 text-black hover:bg-green-400",
          })}
        >
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxWidthWrapper>
      <Link
  href="/feedback"
  className="fixed bottom-5 right-5 flex items-center justify-center rounded-full hover:cursor-pointer"
  title="Submit Feedback"
>
  <button className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-500 font-medium text-black transition-all duration-300 hover:w-32 hover:bg-green-400">
    <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">
      Feedback
    </div>
    <div className="absolute right-3">
      <MessageSquarePlus size="22" className="text-black" />
    </div>
  </button>
</Link>
      
      {/* Feature section */}
      <Features />

      {/* Steps section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 sm:text-5xl">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-white">
              Chatting to your PDF files has never been easier than with
              DocXpert.
            </p>
          </div>
        </div>

        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-500 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-500">Step 1</span>
              <span className="text-xl font-semibold text-white">
                Sign up for an account
              </span>
              <span className="mt-2 text-white">
                Either starting out with a free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-green-500 underline underline-offset-2"
                >
                  pro plan
                </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-500 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-500">Step 2</span>
              <span className="text-xl font-semibold text-white">
                Upload your PDF file
              </span>
              <span className="mt-2 text-white">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-500 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-500">Step 3</span>
              <span className="text-xl font-semibold text-white">
                Start asking questions
              </span>
              <span className="mt-2 text-white">
                It&apos;s that simple. Try out DocXpert today - it really takes
                less than a minute.
              </span>
            </div>
          </li>
        </ol>
      </div>
      {/* Use Cases */}
      <UseCases />
      {/* Testimonials section */}
      <Testimonials />
      

      {/* Footer component */}
      <Footer />
    </div>
  );
}
