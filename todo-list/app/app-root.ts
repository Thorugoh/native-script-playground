import { EventData, TabView, Frame } from "@nativescript/core";

export function onTabChanged(args: any) {
    const tab = args.object as TabView;
    if (args.newIndex === 2) {
        tab.selectedIndex = 0;
        const homeFrame = Frame.getFrameById('homeFrame');
        if (homeFrame) {
            homeFrame.navigate({
                moduleName: 'add-task/add-task-page',
                transition: { name: 'slideTop', duration: 200 },
            });
        }
    }
}
