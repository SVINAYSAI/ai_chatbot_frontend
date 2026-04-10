import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, getSession, clearSession } from "../api/chatApi";
import { useChatStore } from "../store/chatStore";
import toast from "react-hot-toast";

export const useSendMessage = () => {
  const { sessionToken, setSessionToken, addMessage, setLoading } = useChatStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ message }) => sendMessage(sessionToken, message),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      const { session_token, reply, action_taken, booking_ref } = data.data;
      
      if (!sessionToken) {
        setSessionToken(session_token);
      }
      
      addMessage("assistant", reply);
      
      if (action_taken === "booked" && booking_ref) {
        toast.success(`Booking confirmed! Reference: ${booking_ref}`);
      }
      
      setLoading(false);
    },
    onError: (error) => {
      toast.error("Failed to send message. Please try again.");
      addMessage("assistant", "Sorry, I ran into an issue. Please try again in a moment.");
      setLoading(false);
    },
  });
};

export const useGetSession = (sessionToken) => {
  return useQuery({
    queryKey: ["chat-session", sessionToken],
    queryFn: () => getSession(sessionToken).then(r => r.data),
    enabled: !!sessionToken,
  });
};

export const useClearSession = () => {
  const { reset } = useChatStore();
  
  return useMutation({
    mutationFn: (sessionToken) => clearSession(sessionToken),
    onSuccess: () => {
      reset();
      toast.success("Chat session cleared");
    },
    onError: () => {
      toast.error("Failed to clear session");
    },
  });
};
