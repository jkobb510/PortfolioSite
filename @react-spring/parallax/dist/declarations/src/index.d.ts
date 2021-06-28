import * as React from 'react';
import { CSSProperties } from 'react';
import { Controller, SpringConfig } from '@react-spring/web';
export interface IParallaxLayer {
    horizontal: boolean;
    sticky: StickyConfig;
    isSticky: boolean;
    setHeight(height: number, immediate?: boolean): void;
    setPosition(height: number, scrollTop: number, immediate?: boolean): void;
}
export interface IParallax {
    config: ConfigProp;
    horizontal: boolean;
    busy: boolean;
    space: number;
    offset: number;
    current: number;
    controller: Controller<{
        scroll: number;
    }>;
    layers: Set<IParallaxLayer>;
    scrollTo(offset: number): void;
    update(): void;
    stop(): void;
}
declare type ViewProps = React.ComponentPropsWithoutRef<'div'>;
declare type StickyConfig = {
    start?: number;
    end?: number;
} | undefined;
export interface ParallaxLayerProps extends ViewProps {
    horizontal?: boolean;
    /** Size of a page, (1=100%, 1.5=1 and 1/2, ...) */
    factor?: number;
    /** Determines where the layer will be at when scrolled to (0=start, 1=1st page, ...) */
    offset?: number;
    /** Shifts the layer in accordance to its offset, values can be positive or negative */
    speed?: number;
    /** Layer will be sticky between these two offsets, all other props are ignored */
    sticky?: StickyConfig;
}
export declare const ParallaxLayer: React.MemoExoticComponent<React.ForwardRefExoticComponent<ParallaxLayerProps & React.RefAttributes<IParallaxLayer>>>;
declare type ConfigProp = SpringConfig | ((key: string) => SpringConfig);
export interface ParallaxProps extends ViewProps {
    /** Determines the total space of the inner content where each page takes 100% of the visible container */
    pages: number;
    config?: ConfigProp;
    enabled?: boolean;
    horizontal?: boolean;
    innerStyle?: CSSProperties;
}
export declare const Parallax: React.MemoExoticComponent<React.ForwardRefExoticComponent<ParallaxProps & React.RefAttributes<IParallax>>>;
export {};
