declare namespace GPMDP.UI {
    interface ModalState {
        open: boolean;
    }

    interface ContainerProps {
        children: any;
    }

    interface ThemeContext {
        muiTheme: any;
    }

    interface ThemedComponentProps {
        theme?: boolean;
        themeType?: 'FULL' | 'HIGHLIGHT_ONLY';
        themeColor?: string;
    }
}