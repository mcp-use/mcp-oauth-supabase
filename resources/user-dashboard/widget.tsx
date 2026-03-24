import {
  McpUseProvider,
  useCallTool,
  useWidget,
  type WidgetMetadata,
} from "mcp-use/react";
import React, { useCallback, useEffect, useState } from "react";
import "../styles.css";
import { propSchema, type Todo, type UserDashboardProps } from "./types";

export const widgetMetadata: WidgetMetadata = {
  description: "Authenticated user dashboard with todo management",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    invoking: "Loading profile...",
    invoked: "Profile loaded",
  },
};

function AuthBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#3ECF8E]/15 text-[#3ECF8E]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
      Authenticated
    </span>
  );
}

function UserHeader({ email, userId }: { email: string; userId: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] text-sm font-bold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {email}
          </span>
          <AuthBadge />
        </div>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono truncate block">
          {userId}
        </span>
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  isToggling,
}: {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  isToggling: boolean;
}) {
  const date = new Date(todo.created_at);
  const formatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
        todo.completed
          ? "bg-gray-50 dark:bg-gray-800/50"
          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
      } ${isToggling ? "opacity-50 pointer-events-none" : ""}`}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        disabled={isToggling}
        className={`shrink-0 w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? "bg-[#3ECF8E] border-[#3ECF8E]"
            : "border-gray-300 dark:border-gray-600 hover:border-[#3ECF8E]"
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm ${
          todo.completed
            ? "text-gray-400 dark:text-gray-500 line-through"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {todo.title}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
        {formatted}
      </span>
    </div>
  );
}

function AddTodoForm({ onAdd, isAdding }: { onAdd: (title: string) => void; isAdding: boolean }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-3 py-2.5 border-t border-gray-200 dark:border-gray-700">
      <input
        type="text"
        placeholder="Add a new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isAdding}
        className="flex-1 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]/40 focus:border-[#3ECF8E] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!title.trim() || isAdding}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#3ECF8E] text-white hover:bg-[#38b87f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {isAdding ? (
          <>
            <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Adding...
          </>
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
}

function UnauthenticatedView() {
  return (
    <McpUseProvider autoSize>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Authentication Required
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[240px]">
          Please authenticate via OAuth to access your dashboard and todos.
        </p>
      </div>
    </McpUseProvider>
  );
}

const UserDashboard: React.FC = () => {
  const { props, isPending } = useWidget<UserDashboardProps>();

  const { callToolAsync: listTodos, isPending: isLoadingTodos } = useCallTool("list-todos");
  const { callToolAsync: createTodo, isPending: isCreatingTodo } = useCallTool("create-todo");
  const { callToolAsync: toggleTodo, isPending: isTogglingTodo } = useCallTool("toggle-todo");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!props?.isAuthenticated || hasFetched) return;
    setHasFetched(true);
    listTodos({ status: "all" }).then((result) => {
      if (result?.todos) setTodos(result.todos);
    });
  }, [props?.isAuthenticated, hasFetched, listTodos]);

  const handleAddTodo = useCallback(
    (title: string) => {
      createTodo({ title }).then(() => {
        listTodos({ status: "all" }).then((result) => {
          if (result?.todos) setTodos(result.todos);
        });
      });
    },
    [createTodo, listTodos]
  );

  const handleToggleTodo = useCallback(
    (id: number, completed: boolean) => {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
      toggleTodo({ id, completed }).then(() => {
        listTodos({ status: "all" }).then((result) => {
          if (result?.todos) setTodos(result.todos);
        });
      });
    },
    [toggleTodo, listTodos]
  );

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-[#3ECF8E] border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</span>
          </div>
        </div>
      </McpUseProvider>
    );
  }

  if (!props?.isAuthenticated) {
    return <UnauthenticatedView />;
  }

  const { user } = props;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <McpUseProvider autoSize>
      <div className="flex flex-col">
        <UserHeader email={user.email} userId={user.userId} />

        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Todos
            </h4>
            {(isLoadingTodos && !todos.length) ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#3ECF8E]">
                <span className="h-2 w-2 rounded-full bg-[#3ECF8E] animate-pulse" />
                Loading...
              </span>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                {pendingCount} pending · {completedCount} done
              </span>
            )}
          </div>
          {isCreatingTodo && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#3ECF8E]">
              <span className="h-2 w-2 rounded-full bg-[#3ECF8E] animate-pulse" />
              Saving...
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto max-h-[360px] p-2 space-y-1">
          {todos.length === 0 && !isLoadingTodos && (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
              No todos yet. Add one below!
            </div>
          )}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              isToggling={isTogglingTodo}
            />
          ))}
        </div>

        <AddTodoForm onAdd={handleAddTodo} isAdding={isCreatingTodo} />
      </div>
    </McpUseProvider>
  );
};

export default UserDashboard;
