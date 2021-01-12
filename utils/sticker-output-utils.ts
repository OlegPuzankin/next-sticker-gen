import { I_Grape, StickerType, SubjectsType } from './../redux/interfaces';
import format from 'date-fns/format'
import axios from 'axios'
import { Media, Document, Paragraph, WidthType, TextRun, TableCell, TableRow, Table, AlignmentType, PageBreak, HorizontalPositionAlign, VerticalPositionAlign, VerticalPositionRelativeFrom } from 'docx';


export function getTitle(sticker: StickerType) {


    const result = [];
    if (sticker.regionControl === 'PJI') {
        result.push('Вино із захищеною географічною ознакою, ')
    } else if (sticker.regionControl === 'PDO') {
        result.push('Вино із захищеним найменуванням за походженням, ')
    } else
        result.push('Вино виноградне, ');

    if (sticker.selectedGrapes.length === 1)
        result.push('сортове, ');
    else
        result.push('купажоване, ');


    if (Number(sticker.sugar) <= 5)
        result.push('сухе, ');
    else if (Number(sticker.sugar) > 5 && Number(sticker.sugar) < 30)
        result.push('напівсухе, ');
    else if (Number(sticker.sugar) > 30 && Number(sticker.sugar) < 80)
        result.push('напівсолодке, ');
    else if (Number(sticker.sugar) >= 80)
        result.push('солодке, ');

    result.push(`${sticker.color.toLowerCase()} `);
    result.push(`${sticker.stickerTitle}.`);
    return result.join('')

}

export function getDesription(
    country: string,
    harvestYear: string,
    selectedGrapes: Array<I_Grape>,
    servingTemperature: string,
    region?: string,
    appellation?: string,

) {
    const result = [];
    result.push(`Країна походження: ${country}. `);
    if (region) {
        result.push(`Регіон: ${region}`);
        if (appellation)
            result.push(`, ${appellation}. `);
        else
            result.push('. ')
    }
    // const grapes=sticker.selectedGrapes.map(g=>g.toLowerCase())
    // const grapesResult = grapes.join(', ');
    result.push(`Рік врожаю: ${harvestYear}. `);

    const _selectedGrapesNames = selectedGrapes.map(g => g.name)

    if (selectedGrapes.length === 1)
        result.push(`Сорт винограду: ${_selectedGrapesNames.join(', ')}. `);
    else
        result.push(`Сорти винограду: ${_selectedGrapesNames.join(', ')}. `);

    result.push(`Рекомендована температура сервірування від +${servingTemperature}°С до +${Number(servingTemperature) + 2}°С. `);


    return result.join('');
}

export function getShelfLifetime(shelfLifetime: string) {
    if (Number(shelfLifetime) === 1)
        return `1 рік`;
    else if (Number(shelfLifetime) >= 5)
        return `${shelfLifetime} років. `;
    else
        return `${shelfLifetime} роки. `
}

export function getSugar(sugar: string) {
    return Number(sugar) > 4 ? `Вміст цукру: ${Number(sugar) / 10} mass.(% мас.)` : ''
}

export function getVolume(volume: string) {
    return `${Number(volume) / 1000} л(L)`

}

export async function getStickerWordData(stickers: Array<StickerType>, doc: Document) {
    let children: Array<(Paragraph | Table | PageBreak)> = []


    for (const sticker of stickers) {
        const title = getTitle(sticker);

        const desription = getDesription(
            sticker.country.name,
            sticker.harvestYear,
            sticker.selectedGrapes,
            sticker.servingTemperature,
            sticker.region?.name,
            sticker.appellation?.name,
        );
        const bottlingDate = format(new Date(sticker.bottlingYear), 'dd.MM.yyyy');

        //todo - put barcode from incoming sticker
        const imageBase64 = await axios.post('/api/bc', { barcode: sticker.barcode })
        const image1 = Media.addImage(
            doc,
            Buffer.from(imageBase64.data, "base64"), 250, 100, {
            floating: {
                horizontalPosition: {
                    align: HorizontalPositionAlign.RIGHT
                },
                verticalPosition: {
                    offset: 2800000
                    // align: VerticalPositionAlign.BOTTOM,
                    // relative: VerticalPositionRelativeFrom.BOTTOM_MARGIN

                }
            }
        });

        const stickerTitle = new Paragraph({
            text: sticker.originalTitle,
            style: 'title',
        })

        const stickerBodyTable = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({ text: title, style: 'title2', alignment: AlignmentType.CENTER }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: desription }),
                                        new TextRun('Гарантійний термін зберігання '),
                                        new TextRun(getShelfLifetime(sticker.shelfLifetime)),
                                        new TextRun('Якщо після закінчення гарантійного терміну зберігання, не з’явились помутніння чи видимий осад, вино придатне для подальшого зберігання та реалізації. Зберігати в затемнених приміщеннях за температури від + 5˚С до + 20˚С. Без додавання спирту, цукру, без додавання концентратів. '),
                                        new TextRun('Містить '), new TextRun({ text: 'сульфіти.', bold: true }),
                                        new TextRun(getSugar(sticker.sugar)),
                                    ], style: 'normalPara'
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Виробник: ', bold: true }),
                                        new TextRun({ text: sticker.producer.producerFullData }),
                                    ], style: 'normalPara'

                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Iмпортер: ', bold: true }),
                                        new TextRun({ text: 'ТОВ «СІЛЬПО-ФУД» вул. Бутлерова 1, м. Київ, 02090, Україна, тел.: +38 044 496 32 55.' }),
                                    ], style: 'normalPara'

                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Дата виготовлення (розливу)/Bottling date: ' }),
                                        new TextRun({ text: bottlingDate }),
                                    ], style: 'normalPara'
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Номер партії/Lot number: ' }),
                                        new TextRun({ text: sticker.lotNumber }),
                                    ], style: 'normalPara'
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Місткість: ' }),
                                        new TextRun({ text: getVolume(sticker.volume), bold: true }),
                                    ], style: 'normalPara'
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: 'Вміст спирту: ' }),
                                        new TextRun({ text: `${sticker.alcohol} об. (% vol.)`, bold: true }),
                                    ], style: 'normalPara'
                                }),
                                new Paragraph({
                                    children: [image1],

                                })
                            ],
                            margins: {
                                top: 400,
                                bottom: 400,
                                left: 400,
                                right: 400,
                            },
                        })

                    ]
                })
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            }


        })

        children.push(stickerTitle, stickerBodyTable, new Paragraph({
            text: '',
            pageBreakBefore: true

        }))

    }

    return children

}
