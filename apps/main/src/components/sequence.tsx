import type { ReactNode } from "react";

import styles from "./sequence.module.css";

// @lfy def/components/sequence.lfy:Step
export type Step = {
  // @lfy def/components/sequence.lfy:Step.title
  readonly title: ReactNode;
  // @lfy def/components/sequence.lfy:Step.content
  readonly content: ReactNode;
};

// @lfy def/components/sequence.lfy:Steps#Steps:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/sequence.lfy:Steps#Steps:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type StepsProps = {
  readonly steps: readonly Step[];
};

// @lfy def/components/sequence.lfy:Steps#Steps:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/sequence.lfy:Steps#Steps:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Steps({ steps }: StepsProps) {
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:8cecc0b7410ec5af4037f0c6c68ad192bb70c9d056a60b8d584aa8bd1327db7b
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:3f882067bc70697ef6bb75fa6323ac15349236a717acf28c0e116ac4a8013230
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:9cebe131992d9ff4df970e5af51699c1fdd767f198d3ddebb5cf2bb2605a858a
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:d87fa3ebdef3f977513cf31e0ae303cc5d1bb1226c8e4ff1be441f2c0624b9b6
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:f0593b7edb5a22d26fe00049f67e57cf451ca75876a26d021a28bde921b7aeba
  // @lfy def/components/sequence.lfy:Steps#Steps:Steps:1b18aff95f1be541b654be8071b5af28ddbd8f91ea9366d4874a0c920e5bab1f
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li className={styles.step} key={index}>
          <div className={styles.markerColumn}>
            <span className={styles.marker}>{index + 1}</span>
            {index < steps.length - 1 ? (
              <span className={styles.line} aria-hidden="true" />
            ) : null}
          </div>
          <div className={styles.body}>
            <h3 className={styles.title}>{step.title}</h3>
            <div className={styles.content}>{step.content}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// @lfy def/components/sequence.lfy:FlowStage
export type FlowStage = {
  // @lfy def/components/sequence.lfy:FlowStage.label
  readonly label: ReactNode;
  // @lfy def/components/sequence.lfy:FlowStage.description
  readonly description: ReactNode;
};

// @lfy def/components/sequence.lfy:Flow#Flow:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/sequence.lfy:Flow#Flow:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type FlowProps = {
  readonly stages: readonly FlowStage[];
};

// @lfy def/components/sequence.lfy:Flow#Flow:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/sequence.lfy:Flow#Flow:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Flow({ stages }: FlowProps) {
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:5221f7540bc7fa6038cdab346bb8c64a9a60180b42f4baf978c9415821257756
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:b9877c95413e9bf9de70d0fae32a2538dd51cd7729f7e28d802222407ca22ab9
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:a3dc18b74ca2487e7ba059765dfb6e9af24e473a9b69e1e5a456a6f5ba13fb89
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:48ea308560893a8f80b527e8db8fa3f37e32f54cfb40ce47ab0827c0293f227a
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:5af4e3d43922a68608bf5873e9ca250b56a49b3b164b84e48bfdabfd679901dd
  // @lfy def/components/sequence.lfy:Flow#Flow:Flow:a22f0b84e417f7fa99de90f0bb220b543cf12f28f72a1427a907069e2e2b4ed0
  return (
    <div className={styles.flowContainer}>
      <ul className={styles.flow}>
        {stages.map((stage, index) => (
          <li className={styles.stage} key={index}>
            {index > 0 ? (
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            ) : null}
            <div className={styles.box}>
              <div className={styles.stageLabel}>{stage.label}</div>
              <div className={styles.stageDescription}>{stage.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// @lfy def/components/sequence.lfy:Columns#Columns:component:e0d5a65545a376a9b3621b003d41d99811ea7a3a87ce294d757d5ffac0e57a15
// @lfy def/components/sequence.lfy:Columns#Columns:component:85b63371a088bb4a894d438a609f6e91806c1dbdab78a0840b1858a9aa1459fe
export type ColumnsProps = {
  readonly content: ReactNode;
};

// @lfy def/components/sequence.lfy:Columns#Columns:component:dcdaadb98aeb43710c52a33c6ea55d7800c90b914a5ac7c24b404128b5fa2063
// @lfy def/components/sequence.lfy:Columns#Columns:component:9c8275c3e331bb09c56e84bc90676cb83e91fffd66a869052c6829fd983bf39e
export function Columns({ content }: ColumnsProps) {
  // @lfy def/components/sequence.lfy:Columns#Columns:Columns:4b8b2aa30315aa8618f135122203e5aa65ff30a1b5ebd11ac02cf1ef1360e397
  // @lfy def/components/sequence.lfy:Columns#Columns:Columns:b5a8a4f0def8beb89a7e9f3f85566bd1a4cc69b626e3a5930493589ac91e6673
  return (
    <div className={styles.columnsContainer}>
      <div className={styles.columns}>{content}</div>
    </div>
  );
}
