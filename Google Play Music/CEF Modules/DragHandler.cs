using CefSharp;

namespace Google_Play_Music.CEF_Modules
{
    public class GPMDragHandler : IDragHandler
    {
        bool IDragHandler.OnDragEnter(IWebBrowser browserControl, IBrowser browser, IDragData dragData, DragOperationsMask mask)
        {
            // Returning true cancels the drag (no idea why...) #CEFLogic
            return true;
        }
    }
}
