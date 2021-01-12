// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import bwipjs from 'bwip-js'

export default (req: NextApiRequest, res: NextApiResponse) => {


  const buffer = bwipjs.toBuffer({
    bcid: 'ean13',       // Barcode type
    text: req.body.barcode.toString(),    // Text to encode
    scale: 3,               // 3x scaling factor
    height: 10,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign: 'center',        // Always good to set this
  }, (error, buffer) => {
    if (!error) {
      res.statusCode = 201
      res.send(buffer.toString('base64'))
    }
  })
}


