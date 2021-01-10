import { StickerType, SubjectsType } from './../redux/interfaces';
import { Document, Packer, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import { getStickerWordData } from './sticker-output-utils';




export async function saveToWord(stickers: Array<StickerType>) {

    const doc = new Document({
        styles: {

            paragraphStyles: [
                {
                    id: "title",
                    name: "Title",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri",
                        size: 32,
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                        // rightTabStop: TabStopPosition.MAX,
                        // leftTabStop: 453.543307087,

                    },
                },
                {
                    id: "title2",
                    name: "Title2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri",
                        size: 26,
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                        // rightTabStop: TabStopPosition.MAX,
                        // leftTabStop: 453.543307087,

                    },
                },
                {
                    id: "normalPara",
                    name: "Normal Para",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Calibri",
                        size: 24,
                    },
                    paragraph: {
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { line: 276 },
                    },
                },

            ],

        },
    });

    const children = await getStickerWordData(stickers, doc)
    debugger
    //todo
    doc.addSection({
        children: children
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "sticker.docx");
    });
}


