const fs = require('fs');

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') { currentField += '"'; i++; }
                else inQuotes = false;
            } else currentField += char;
        } else {
            if (char === '"') inQuotes = true;
            else if (char === ',') { currentRow.push(currentField); currentField = ''; }
            else if (char === '\r') {
                if (nextChar === '\n') i++;
                currentRow.push(currentField); rows.push(currentRow); currentRow = []; currentField = '';
            } else if (char === '\n') {
                currentRow.push(currentField); rows.push(currentRow); currentRow = []; currentField = '';
            } else currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) { currentRow.push(currentField); rows.push(currentRow); }
    return rows;
}

const lineDefinitions = {
    "Mặc Hằng Ngày": "Dòng trang phục cơ bản, thiết yếu (Casual Essentials). Phù hợp mặc hằng ngày, đi học, đi làm, đi chơi; ưu tiên tính ứng dụng, dễ phối đồ, chuẩn phom và bền bỉ.",
    "Nâng Cấp Hiệu Năng": "Dòng trang phục tích hợp công nghệ sợi và giải pháp kỹ thuật may hiện đại (chống nhăn, làm mát, nhanh khô, kháng khuẩn, co giãn đàn hồi, nâng đỡ vòng eo).",
    "Bề Mặt Vải Khác Biệt": "Dòng sản phẩm tạo điểm nhấn bằng cấu trúc dệt và hiệu ứng chất liệu vải độc đáo (dệt nổi, sọc, caro, vải linen xước, giả da mềm...) mang lại chiều sâu thị giác.",
    "Màu Sắc Đặc Biệt Và Hiệu Ứng Màu": "Dòng thời trang cá tính ứng dụng công nghệ xử lý màu tiên tiến (nhuộm loang Tie-Dye/Wash, Tek Black đen sâu kháng bạc màu, jean wash đa sắc).",
    "Dáng Ống Đặc Biệt": "Dòng quần với phom dáng cắt may phá cách, tôn dáng và che khuyết điểm chân (ống cong Curved, ống siêu rộng Loose Fit, ống loe Flared, ống chữ A).",
    "Thiết Kế Khác Biệt": "Dòng trang phục có kết cấu rã rập, phối mảng màu (Color Block) hoặc viền nổi tạo hình (Line Art) phong cách streetwear trẻ trung.",
    "Hình In Và Thêu": "Dòng sản phẩm tập trung vào nghệ thuật đồ họa (Graphic linh vật thương hiệu, nghệ thuật chữ Typography, hình in tràn lưng Over Graphic).",
    "Thể Thao": "Dòng trang phục activewear chuyên dụng cho vận động, tập gym, chạy bộ với chất liệu siêu nhẹ, thoáng khí, kháng UV và thoát mồ hôi tối ưu.",
    "Đơn sắc": "Dòng sản phẩm tối giản, đơn sắc trơn không họa tiết, hướng đến phong cách thanh lịch và tinh tế."
};

const versionDefinitions = {
    "Cơ Bản": "Thiết kế chuẩn mực, dễ mặc, tối giản chi tiết.",
    "Văn Phòng": "Thiết kế thanh lịch, phom đứng, phù hợp môi trường công sở.",
    "Văn Phòng Cơ Bản": "Dáng quần tây chuẩn mực, tôn dáng, sang trọng cho nam giới văn phòng.",
    "Túi Hộp": "Phong cách Cargo cá tính với túi hộp tiện dụng hai bên thân quần.",
    "Mát Hơn": "Ứng dụng công nghệ sợi làm mát (IceVibes™) giải nhiệt vật lý tức thì, tạo cảm giác mát dịu.",
    "Khô Thoáng Hơn": "Chất liệu AirDry™/Ultra-thin hút ẩm nhanh và thoát hơi nước siêu tốc, giữ cơ thể luôn khô ráo.",
    "Mềm Mịn Hơn": "Công nghệ dệt CloudTouch™ vi sợi micro-nap siêu êm da, loại bỏ cảm giác thô ráp.",
    "Kháng Khuẩn Tốt Hơn": "Sợi StayFresh™ có khả năng ức chế vi khuẩn phát triển, chống bám mùi cơ thể suốt ngày dài.",
    "Co Giãn Tốt Hơn": "Vải dệt đàn hồi 4 chiều linh hoạt (FlexFit™) hỗ trợ vận động tối đa mà không mất phom.",
    "Vòng Eo Dễ Chịu Hơn": "Cạp lưng quần thiết kế thông minh (lưng thun co giãn ẩn hoặc hạ đáy rã nới) giảm áp lực lên bụng.",
    "Chống Tuột Áo": "Lưng quần trang bị viền silicon mặt trong giúp giữ chặt vạt áo sơ mi không bị tuột xộc xệch.",
    "Bảo Vệ Thời Tiết Tốt Hơn": "Vải phủ màng trượt nước (RainShield™), cản gió và chống tia UV bảo vệ cơ thể khi ra ngoài.",
    "Ống Cong": "Phom dáng sườn đánh cong độc đáo (Curved leg), phồng nhẹ ở đùi và thuôn mượt xuống lai, phong cách trendy.",
    "Ống Siêu Rộng": "Dáng Loose Fit rộng rãi, hạ đáy sâu giúp hack chiều cao và tạo độ rủ phóng khoáng.",
    "Ống Suông": "Dáng Regular/Straight suông thẳng từ hông xuống gấu, cân đối và tôn chân cho mọi vóc dáng.",
    "Ống Loe": "Phom ôm nhẹ phần đùi và loe từ gối xuống gấu, tạo hiệu ứng kéo dài đôi chân đậm chất retro.",
    "Ống Chữ A": "Dáng quần đùi mở rộng dần xuống gấu quần, giúp người mặc cảm giác thoải mái và che bắp chân to.",
    "Dệt Nổi": "Bề mặt dệt dập nổi họa tiết vân chéo, mắt lưới waffle hoặc gân nổi 3D sang trọng.",
    "Dệt Sọc": "Đường vân sọc dệt chìm hoặc phối màu thanh lịch, kéo dài thị giác giúp người mặc thon gọn hơn.",
    "Dệt Caro": "Họa tiết kẻ ô vuông caro dệt từ sợi màu, cổ điển và trẻ trung.",
    "Giả Da": "Chất liệu da nhân tạo cao cấp (PU mềm hoặc da lộn), cản gió tốt, vẻ ngoài phong trần cá tính.",
    "Vải Linen": "Sợi lanh tự nhiên nhẹ xốp, có nếp xước mộc mạc đặc trưng, thông thoáng vượt trội.",
    "Hiệu Ứng Nhăn": "Xử lý mặt vải tạo nếp nhăn tự nhiên nghệ thuật (Crinkle), không lo nhàu nhĩ khi giặt ủi.",
    "Loang Màu": "Hiệu ứng nhuộm Tie-Dye hoặc Wash tạo mảng màu chuyển sắc phá cách, bụi bặm phong trần.",
    "Tek Black": "Công nghệ nhuộm ColorLock™ nhuộm từ lõi xơ (Dope Dye) đen tuyền sâu thẳm, kháng bạc màu cực cao.",
    "Multi Color Jean": "Kỹ thuật wash denim xử lý đa sắc độ màu, tạo chất bụi phủi cổ điển và cá tính.",
    "Phối Rã Mảng Màu": "Thiết kế cắt rã và ghép nối các mảng màu tương phản hoặc vải khác biệt (Color Block).",
    "Viền Nổi (line Art)": "Các đường may bọc viền nổi bật chạy dọc thân áo tạo điểm nhấn thể thao khỏe khoắn.",
    "Linh Vật": "Hình in/thêu linh vật thương hiệu đáng yêu, độc quyền tạo dấu ấn nhận diện.",
    "Typography": "Thiết kế ứng dụng nghệ thuật sắp đặt chữ và khẩu hiệu thời trang sắc nét.",
    "Over Graphic": "Hình in họa tiết kích thước lớn ấn tượng (ở lưng hoặc toàn thân áo).",
    "Beginner": "Dòng thể thao cơ bản: nhẹ nhàng, co giãn vừa vặn, dành cho người mới bắt đầu tập luyện.",
    "Trainer": "Dòng thể thao chuyên sâu: tích hợp mảng lưới thoáng nhiệt, chịu lực cao cho cường độ tập mạnh.",
    "Cổ Bẻ": "Thiết kế cổ áo bẻ truyền thống, chỉn chu và đa năng."
};

function build() {
    const aoRows = parseCSV(fs.readFileSync(__dirname + '/data/ao.csv', 'utf8'));
    const quanRows = parseCSV(fs.readFileSync(__dirname + '/data/quan.csv', 'utf8'));

    function extract(rows, typeName) {
        const headers = rows[1].map(h => h.trim());
        const col = {};
        headers.forEach((h, i) => col[h] = i);

        const items = [];
        rows.slice(2).forEach(r => {
            if (r.length < 5 || !r.some(c => c.trim())) return;
            let chungLoai = (r[col['Chủng Loại']] || '').trim();
            let kieuSP = (r[col['Kiểu SP']] || '').trim();
            let dongSP = (r[col['Dòng SP']] || '').trim();
            if (dongSP.toLowerCase() === 'mặc hằng ngày') dongSP = 'Mặc Hằng Ngày';
            let phienBan = (r[col['Phiên Bản']] || '').trim();
            let link = (r[col['Link']] || r[col['Hình ảnh']] || '').trim();
            if (link.startsWith('http://')) link = link.replace('http://', 'https://');
            let id = (r[col['ID sản phẩm']] || '').trim();
            let sku = (r[col['SKU']] || '').trim();
            let color = (r[col['Màu']] || '').trim();
            let name = (r[col['Tên sản phẩm (Name)']] || '').trim();
            let webName = (r[col['TenSanPhamWebsite']] || '').trim();
            let shortDesc = (r[col['Mô tả ngắn (Short Description)']] || '').trim();
            let desc = (r[col['Mô tả chi tiết (Description)']] || '').trim();
            let ktp = (r[col['Key Talking Point']] || '').trim();

            if (!chungLoai || !kieuSP || !dongSP) return;

            items.push({
                rootType: typeName,
                chungLoai,
                kieuSP,
                dongSP,
                phienBan: phienBan || 'Tiêu Chuẩn',
                link,
                id: id || sku,
                sku,
                color,
                name: name || webName,
                webName,
                shortDesc,
                desc,
                ktp,
                status: (r[col['Trạng thái bán hàng (Sale Status)']] || '').trim() || 'Chưa rõ'
            });
        });
        return items;
    }

    const rawItems = [...extract(aoRows, 'Áo'), ...extract(quanRows, 'Quần')];

    // Group items into models by (kieuSP, dongSP, phienBan, id or name)
    const modelsMap = new Map();
    rawItems.forEach(it => {
        const key = `${it.chungLoai}|||${it.kieuSP}|||${it.dongSP}|||${it.phienBan}|||${it.id || it.name}`;
        if (!modelsMap.has(key)) {
            modelsMap.set(key, {
                id: it.id,
                name: it.name,
                webName: it.webName,
                chungLoai: it.chungLoai,
                kieuSP: it.kieuSP,
                dongSP: it.dongSP,
                phienBan: it.phienBan,
                shortDesc: it.shortDesc,
                desc: it.desc,
                ktp: it.ktp,
                mainImg: it.link,
                colors: []
            });
        }
        const m = modelsMap.get(key);
        if (it.link && !m.mainImg) m.mainImg = it.link;
        if (it.ktp && !m.ktp) m.ktp = it.ktp;
        if (it.desc && !m.desc) m.desc = it.desc;
        if (it.shortDesc && !m.shortDesc) m.shortDesc = it.shortDesc;
        m.colors.push({
            color: it.color,
            sku: it.sku,
            img: it.link,
            status: it.status
        });
    });

    const models = Array.from(modelsMap.values());
    console.log(`Aggregated ${rawItems.length} SKUs into ${models.length} product models.`);

    // Build hierarchy for mindmap
    const tree = {
        name: "Danh Mục Quần Áo 2026",
        children: []
    };

    const chungLoaiMap = new Map();

    models.forEach(m => {
        if (!chungLoaiMap.has(m.chungLoai)) {
            chungLoaiMap.set(m.chungLoai, new Map());
        }
        const kieuMap = chungLoaiMap.get(m.chungLoai);
        if (!kieuMap.has(m.kieuSP)) {
            kieuMap.set(m.kieuSP, new Map());
        }
        const dongMap = kieuMap.get(m.kieuSP);
        if (!dongMap.has(m.dongSP)) {
            dongMap.set(m.dongSP, new Map());
        }
        const pbMap = dongMap.get(m.dongSP);
        if (!pbMap.has(m.phienBan)) {
            pbMap.set(m.phienBan, []);
        }
        pbMap.get(m.phienBan).push(m);
    });

    for (const [clName, kieuMap] of chungLoaiMap.entries()) {
        const clNode = {
            id: 'cl_' + encodeURIComponent(clName),
            name: clName,
            level: 'chungLoai',
            badge: `${clName}`,
            children: []
        };

        for (const [kieuName, dongMap] of kieuMap.entries()) {
            const kieuNode = {
                id: 'kieu_' + encodeURIComponent(clName + '_' + kieuName),
                name: kieuName,
                level: 'kieuSP',
                children: []
            };

            for (const [dongName, pbMap] of dongMap.entries()) {
                const dongDef = lineDefinitions[dongName] || '';
                const dongNode = {
                    id: 'dong_' + encodeURIComponent(clName + '_' + kieuName + '_' + dongName),
                    name: dongName,
                    level: 'dongSP',
                    definition: dongDef,
                    children: []
                };

                for (const [pbName, pList] of pbMap.entries()) {
                    const pbDef = versionDefinitions[pbName] || '';
                    const pbNode = {
                        id: 'pb_' + encodeURIComponent(clName + '_' + kieuName + '_' + dongName + '_' + pbName),
                        name: pbName,
                        level: 'phienBan',
                        definition: pbDef,
                        modelCount: pList.length,
                        skuCount: pList.reduce((acc, cur) => acc + cur.colors.length, 0),
                        sampleImg: pList[0] ? pList[0].mainImg : '',
                        models: pList
                    };
                    dongNode.children.push(pbNode);
                }
                kieuNode.children.push(dongNode);
            }
            clNode.children.push(kieuNode);
        }
        tree.children.push(clNode);
    }

    const output = {
        tree,
        models,
        lineDefinitions,
        versionDefinitions,
        stats: {
            totalSKUs: rawItems.length,
            totalModels: models.length,
            totalChungLoai: chungLoaiMap.size,
            totalKieuSP: new Set(rawItems.map(x => x.kieuSP)).size,
            totalDongSP: Object.keys(lineDefinitions).length,
            totalPhienBan: Object.keys(versionDefinitions).length
        }
    };

    fs.writeFileSync(__dirname + '/products_mindmap_data.js', 'window.PRODUCT_DATA = ' + JSON.stringify(output) + ';', 'utf8');
    console.log('Saved products_mindmap_data.js successfully!');
}

build();
