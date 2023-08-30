document.addEventListener('DOMContentLoaded', function() {
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 100/100,
        imageResizeTargetWidth: 100,
        imageResizeTargetHeight: 100
    })

    FilePond.parse(document.body);
});  