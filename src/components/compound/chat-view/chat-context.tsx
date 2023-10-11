import { ChangeEvent, PropsWithChildren, createContext, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/common/toast/use-toast";

type ChatContextProps = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextProps>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

type Props = {
  fileId: string;
} & PropsWithChildren;

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ fileId, message }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.body;
    },
  });

  function addMessage() {
    sendMessage({ message });
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
  }

  return (
    <ChatContext.Provider
      value={{ addMessage, handleInputChange, isLoading, message }}
    >
      {children}
    </ChatContext.Provider>
  );
};
