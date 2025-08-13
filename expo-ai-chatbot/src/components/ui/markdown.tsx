import React from "react";
import Markdown from "react-native-markdown-display";
import {
  H1 as ExpoH1,
  H2 as ExpoH2,
  H3 as ExpoH3,
  H4 as ExpoH4,
  H5 as ExpoH5,
  H6 as ExpoH6,
  Code as ExpoCode,
  Pre as ExpoPre,
  UL as ExpoUl,
  LI as ExpoLI,
  Strong as ExpoStrong,
  A as ExpoA,
  P as ExpoP,
  Div as ExpoDiv,
} from "@expo/html-elements";
import { cssInterop } from "nativewind";

const H1 = cssInterop(ExpoH1, { className: "style" });
const H2 = cssInterop(ExpoH2, { className: "style" });
const H3 = cssInterop(ExpoH3, { className: "style" });
const H4 = cssInterop(ExpoH4, { className: "style" });
const H5 = cssInterop(ExpoH5, { className: "style" });
const H6 = cssInterop(ExpoH6, { className: "style" });
const Code = cssInterop(ExpoCode, { className: "style" });
const Pre = cssInterop(ExpoPre, { className: "style" });
const Ol = cssInterop(ExpoUl, { className: "style" });
const Ul = cssInterop(ExpoUl, { className: "style" });
const Li = cssInterop(ExpoLI, { className: "style" });
const Strong = cssInterop(ExpoStrong, { className: "style" });
const A = cssInterop(ExpoA, { className: "style" });
const P = cssInterop(ExpoP, { className: "style" });
const Div = cssInterop(ExpoDiv, { className: "style" });

const rules = {
  heading1: (node, children) => {
    const headingKey = node.key || node.index || `heading1-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading1-child-${index}` })
            : child
        )
      : children;
    return <H4 key={headingKey} className="mb-4 mt-4 font-bold">{keyedChildren}</H4>;
  },
  heading2: (node, children) => {
    const headingKey = node.key || node.index || `heading2-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading2-child-${index}` })
            : child
        )
      : children;
    return <P key={headingKey} className="mb-2 mt-2 font-bold">{keyedChildren}</P>;
  },
  heading3: (node, children) => {
    const headingKey = node.key || node.index || `heading3-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading3-child-${index}` })
            : child
        )
      : children;
    return <P key={headingKey} className="mb-2 mt-2 font-bold">{keyedChildren}</P>;
  },
  heading4: (node, children) => {
    const headingKey = node.key || node.index || `heading4-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading4-child-${index}` })
            : child
        )
      : children;
    return <P key={headingKey} className="mb-2 mt-2 font-bold">{keyedChildren}</P>;
  },
  heading5: (node, children) => {
    const headingKey = node.key || node.index || `heading5-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading5-child-${index}` })
            : child
        )
      : children;
    return <P key={headingKey} className="mb-2 mt-2 font-bold">{keyedChildren}</P>;
  },
  heading6: (node, children) => {
    const headingKey = node.key || node.index || `heading6-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `heading6-child-${index}` })
            : child
        )
      : children;
    return <P key={headingKey} className="mb-2 mt-2 font-bold">{keyedChildren}</P>;
  },
  code: (node, children, parent) => {
    const codeKey = node.key || node.index || `code-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `code-child-${index}` })
            : child
        )
      : children;
    return parent.length > 1 ? (
      <Pre key={`pre-${codeKey}`} className="mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800 md:max-w-[500px]">
        <Code key={`code-${codeKey}`}>{keyedChildren}</Code>
      </Pre>
    ) : (
      <Code key={codeKey} className="rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
        {keyedChildren}
      </Code>
    );
  },
  list_item: (node, children, parent, styles, inheritedStyles, defaultRenderer) => {
    const key = node.key || node.index || `li-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `list-item-child-${index}` })
            : child
        )
      : children;
    return <Li key={key} className="py-1">{keyedChildren}</Li>;
  },
  ordered_list: (node, children, parent, styles, inheritedStyles, defaultRenderer) => {
    const key = node.key || node.index || `ol-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `ordered-list-child-${index}` })
            : child
        )
      : children;
    return <Ol key={key} className="ml-4 list-outside list-decimal">{keyedChildren}</Ol>;
  },
  unordered_list: (node, children, parent, styles, inheritedStyles, defaultRenderer) => {
    const key = node.key || node.index || `ul-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `unordered-list-child-${index}` })
            : child
        )
      : children;
    return <Ul key={key} className="ml-4 list-outside list-decimal">{keyedChildren}</Ul>;
  },
  strong: (node, children) => {
    const strongKey = node.key || node.index || `strong-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `strong-child-${index}` })
            : child
        )
      : children;
    return <Strong key={strongKey} className="font-semibold">{keyedChildren}</Strong>;
  },
  link: (node, children) => {
    const linkKey = node.key || node.index || `link-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `link-child-${index}` })
            : child
        )
      : children;
    return (
      <A
        key={linkKey}
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={node.attributes.href}
      >
        {keyedChildren}
      </A>
    );
  },
  text: (node, children) => {
    // Generate a unique key for the text element
    const textKey = node.key || node.index || `text-${JSON.stringify(node).slice(0, 20)}`;
    
    // Handle empty array case
    if (Array.isArray(children) && children.length === 0) {
      return <P key={textKey} className="">{node.content}</P>;
    }
    
    if (children && Array.isArray(children) && children.length > 0) {
      const keyedChildren = children.map((child, index) => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { key: child.key || `text-child-${index}` })
          : child
      );
      return <P key={textKey} className="">{keyedChildren}</P>;
    }
    
    return <P key={textKey} className="">{node.content || children}</P>;
  },
  paragraph: (node, children) => {
    // Generate a unique key for the paragraph based on node content or position
    const paragraphKey = node.key || node.index || `paragraph-${JSON.stringify(node).slice(0, 20)}`;
    
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `paragraph-child-${index}` })
            : child
        )
      : children;
    return <P key={paragraphKey} className="">{keyedChildren}</P>;
  },
  body: (node, children) => {
    const bodyKey = node.key || node.index || `body-${JSON.stringify(node).slice(0, 20)}`;
    const keyedChildren = Array.isArray(children) 
      ? children.map((child, index) => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { key: child.key || `body-child-${index}` })
            : child
        )
      : children;
    return <Div key={bodyKey} className="">{keyedChildren}</Div>;
  },
};

export function CustomMarkdown({ content }) {
  // Add a more robust unique key based on content hash to help React identify the component
  const contentKey = React.useMemo(() => {
    if (!content) return 'empty';
    // Create a simple hash of the content for better key generation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `markdown-${Math.abs(hash)}`;
  }, [content]);

  // Wrap in a View to isolate the Markdown component and prevent key warnings from bubbling up
  return (
    <React.Fragment key={contentKey}>
      <Markdown 
        key={`markdown-${contentKey}`}
        rules={rules}
        style={{
          body: { margin: 0, padding: 0 },
          paragraph: { margin: 0, padding: 0 },
        }}
      >
        {content}
      </Markdown>
    </React.Fragment>
  );
}
