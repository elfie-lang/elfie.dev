import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./button.module.css";

// @lfy def/atoms.lfy:Button
function classNames(
  ...names: ReadonlyArray<string | false | undefined>
): string {
  return names.filter(Boolean).join(" ");
}

// @lfy def/atoms.lfy:Button
export const ButtonEmphasis = {
  Primary: "primary",
  Secondary: "secondary",
  Ghost: "ghost",
} as const;

export type ButtonEmphasis =
  (typeof ButtonEmphasis)[keyof typeof ButtonEmphasis];

// @lfy def/atoms.lfy:Button
const buttonEmphasisClass: Readonly<
  Record<ButtonEmphasis, string | undefined>
> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

// @lfy def/atoms.lfy:Button
export const ButtonSize = {
  Medium: "medium",
  Large: "large",
} as const;

export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

// @lfy def/atoms.lfy:Button
const buttonSizeClass: Readonly<Record<ButtonSize, string | undefined>> = {
  medium: undefined,
  large: styles.large,
};

// @lfy def/atoms.lfy:Button#Button:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
// @lfy def/atoms.lfy:Button#Button:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/atoms.lfy:Button
type ButtonOwnProps = {
  readonly content: ReactNode;
  readonly emphasis?: ButtonEmphasis;
  readonly size?: ButtonSize;
};

// @lfy def/atoms.lfy:Button
export type ButtonActionProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "content" | "children"
> &
  ButtonOwnProps & { readonly href?: undefined };

// @lfy def/atoms.lfy:Button
export type ButtonLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "content" | "children" | "href"
> &
  ButtonOwnProps & { readonly href: string };

// @lfy def/atoms.lfy:Button#Button:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
// @lfy def/atoms.lfy:Button#Button:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
export type ButtonProps = ButtonActionProps | ButtonLinkProps;

// @lfy def/atoms.lfy:Button#Button:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
// @lfy def/atoms.lfy:Button#Button:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
export function Button(props: ButtonProps) {
  const {
    emphasis = ButtonEmphasis.Primary,
    size = ButtonSize.Medium,
    className,
  } = props;
  const rootClassName = classNames(
    styles.button,
    buttonEmphasisClass[emphasis],
    buttonSizeClass[size],
    className,
  );

  // @lfy def/atoms.lfy:Button#Button:Button:c73df54c9921c04d7a68a74353ec343de9492586e0bb30c59885756315477f31
  if (props.href !== undefined) {
    const {
      content,
      emphasis: _emphasis,
      size: _size,
      className: _className,
      ...rest
    } = props;
    return (
      <a {...rest} className={rootClassName}>
        {content}
      </a>
    );
  }

  const {
    content,
    emphasis: _emphasis,
    size: _size,
    className: _className,
    type = "button",
    ...rest
  } = props;
  // @lfy def/atoms.lfy:Button#Button:Button:661a5b3d6c48efed7635c264e756a0991b9df5a29386ba24da69002906cfdef0
  // @lfy def/atoms.lfy:Button#Button:fromFigma:a11f35501c2b17192a88063450a81bfe1f3f70b7e9241ebda79d53a306277baf
  return (
    <button {...rest} type={type} className={rootClassName}>
      {content}
    </button>
  );
}
