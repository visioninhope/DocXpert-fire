import FeatureCard from "@/components/other/feature-card";
import BouncingLoader from "@/components/ui/bouncing-loader";
import { SpinnerCentered } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { BanIcon, Send, ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

export default function Chat({ isVectorised }: { isVectorised: boolean }) {
  const { query } = useRouter();
  const docId = query?.docId;
  const [isRAGMode, setIsRAGMode] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    append,
    reload,
  } = useChat({
    body: {
      docId: docId as string,
      isRAGMode,
    },
    onError: (err: any) => {
      toast.error(err?.message, {
        duration: 3000,
      });
    },
  });

  const { setSendMessage } = useChatStore();

  useEffect(() => {
    const sendMessage = (message: string) => {
      append({
        id: crypto.randomUUID(),
        content: message,
        role: "user",
      });
    };

    setSendMessage(sendMessage);
  }, []);

  useEffect(() => {
    reload();
  }, [isRAGMode]);

  const { data: prevChatMessages, isLoading: isChatsLoading } =
    api.message.getAllByDocId.useQuery(
      {
        docId: docId as string,
      },
      {
        refetchOnWindowFocus: false,
      },
    );

  const messageWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageWindowRef.current?.scrollTo(
      0,
      messageWindowRef.current.scrollHeight,
    );
  }, [messages, prevChatMessages]);

  const { mutate: vectoriseDocMutation, isLoading: isVectorising } =
    api.document.vectorise.useMutation({
      onSuccess: () => {
        utils.document.getDocData.setData(
          { docId: docId as string },
          (prev) => {
            if (!prev) return undefined;
            return {
              ...prev,
              isVectorised: true,
            };
          },
        );
      },
    });

  const utils = api.useContext();

  if (!isVectorised) {
    return (
      <FeatureCard
        isLoading={isVectorising}
        bulletPoints={[
          "🔍 Search and ask questions about any part of your PDF.",
          "📝 Summarize content with ease.",
          "📊 Analyze and extract data effortlessly.",
        ]}
        onClick={() => {
          vectoriseDocMutation(
            { documentId: docId as string },
            {
              onError: (err: any) => {
                toast.error(err?.message, {
                  duration: 3000,
                });
              },
            },
          );
        }}
        buttonText="Turn PDF Interactive"
        subtext="Easily extract key information and ask questions on the fly:"
        title="Unleash the power of your PDF documents through interactive chat!"
      />
    );
  }

  if (isChatsLoading) {
    return <SpinnerCentered />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsRAGMode(!isRAGMode)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          {isRAGMode ? (
            <>
              <ToggleRight className="w-5 h-5 mr-1" />
              PDF Mode On
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 mr-1" />
              General Mode On
            </>
          )}
        </button>
      </div>
      <div
        className="hideScrollbar flex flex-1 flex-col gap-3 overflow-auto"
        ref={messageWindowRef}
      >
        {[
          {
            id: "id",
            content: isRAGMode
              ? "Welcome to PDF Mode! I'm here to assist you with information specifically from your uploaded PDF. Ask me anything about its content!"
              : "Welcome to General Mode! I'm here to assist you with a wide range of topics. Feel free to ask any question!",
            role: "assistant",
          },
          ...(prevChatMessages ?? []),
          ...messages,
        ].map((m) => (
          <div
            key={m.id}
            className={cn(
              m.role === "user" && "ml-auto",
              m.role === "assistant" && "mr-auto",
              "max-w-[80%] text-left ",
            )}
          >
            <ReactMarkdown
              className={cn(
                m.role === "user" &&
                  "prose-invert bg-blue-500 text-gray-50 prose-code:text-gray-100",
                m.role === "assistant" && "bg-gray-100 ",
                "prose rounded-xl px-3 py-1 prose-ul:pl-2 prose-li:px-2",
              )}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        ))}

        {isLoading && messages.at(-1)?.role === "user" && (
          <div
            className={cn(
              "mr-auto bg-gray-100 text-black",
              "max-w-[80%] rounded-xl px-3 py-2 text-left ",
            )}
          >
            <BouncingLoader />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2 mt-1 flex w-full ">
          <TextareaAutosize
            maxLength={1000}
            placeholder={isRAGMode ? "Ask about your PDF (max 1,000 characters)" : "Ask anything (max 1,000 characters)"}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 font-normal"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                // @ts-ignore
                handleSubmit(e);
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            value={input}
            onChange={handleInputChange}
            autoFocus
            maxRows={4}
          />
          {isLoading ? (
            <button className="w-fit px-2">
              <BanIcon size={24} className="text-gray-500" onClick={stop} />
            </button>
          ) : (
            <button
              className="group w-fit rounded-ee-md rounded-se-md px-2"
              type="submit"
            >
              <Send
                size={24}
                className=" text-gray-600 group-hover:text-gray-700"
                />
              </button>
            )}
          </div>
        </form>
        {isRAGMode && (
          <div className="text-xs text-gray-500 mt-2">
            PDF Mode: Responses are based solely on the content of your uploaded PDF.
          </div>
        )}
      </div>
    );
  }
  
