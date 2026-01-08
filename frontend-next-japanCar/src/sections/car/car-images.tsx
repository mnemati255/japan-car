'use client';

import { Upload } from '@/components/upload';
import { CarImage } from '@/types/car';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
  files?: File[];
};

export default function CarImages({ methods, files }: Props) {
  const { setValue, getValues } = methods;

  const [images, setImages] = useState<CarImage[]>([]);

  useEffect(() => {
    if (images.length > 0 && images.every((x) => x.fileName)) {
      setValue('images', images);
    }
  }, [images, setValue]);

  useEffect(() => {
    const imgs = getValues('images');
    if (files && files.length > 0 && imgs && imgs.length > 0) {
      const newImages: CarImage[] = files.map((file, index) => ({
        fileName: file,
        fileType: imgs[index]?.fileType || '',
      }));
      setTimeout(() => setImages(newImages), 0);
    }
  }, [files, getValues]);

  const addImage = () => {
    setImages([...images, { fileType: '', fileName: null }]);
  };

  const handleTypeChange = (index: number, event: any) => {
    if (event) {
      // const newBoxes = [...imageBoxes];
      // newBoxes[index].fileType = event.target.value;
      // setImageBoxes(newBoxes);
      const newImages = [...images];
      newImages[index].fileType = event.target.value;
      setImages(newImages);
    }
  };

  const handleFilesChange = (index: number, file: File) => {
    // const newBoxes = [...imageBoxes];
    // newBoxes[index].file = file;
    // setImageBoxes(newBoxes);
    const newImages = [...images];
    newImages[index].fileName = file;
    setImages(newImages);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Button variant="soft" onClick={addImage}>
        Add image
      </Button>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          rowGap: 3,
          columnGap: 2,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 2,
              position: 'relative',
            }}
          >
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Image type</InputLabel>
              <Select
                label="Image type"
                value={img.fileType}
                onChange={(e) => handleTypeChange(index, e)}
              >
                <MenuItem value="Front">Front</MenuItem>
                <MenuItem value="Back">Back</MenuItem>
                <MenuItem value="Deed">Deed</MenuItem>
              </Select>
            </FormControl>

            <Upload
              value={img.fileName}
              onDrop={(files: (File | string)[]) => {
                if (files.length > 0) {
                  const file = files[0] as File;
                  handleFilesChange(index, file);
                }
              }}
              onDelete={() => {
                setImages((prev) => prev.filter((_, i) => i !== index));
                // const newBoxes = [...imageBoxes];
                // newBoxes[index].file = null;
                // setImageBoxes(newBoxes);
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// 'use client';

// import { Upload } from '@/components/upload';
// import { UseFormReturn } from 'react-hook-form';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { useEffect, useState } from 'react';
// import { CarImage } from '@/types/car';

// type ImageBox = {
//   fileType: string;
//   files: File[];
// };

// type Props = {
//   methods: UseFormReturn<any>;
//   files?: File[];
//   imagesWithTypes?: CarImage[];
// };

// export default function CarImages({ methods, files, imagesWithTypes }: Props) {
//   const { setValue, getValues } = methods;

//   const [imageBoxes, setImageBoxes] = useState<ImageBox[]>([]);

//   // همگام‌سازی imageBoxes با فرم
//   useEffect(() => {
//     const allFiles = imageBoxes.flatMap((box) =>
//       box.files.map((file) => {
//         return {
//           fileName: file,
//           fileType: box.fileType,
//         };
//       })
//     );
//     setValue('images', allFiles, { shouldValidate: true });
//   }, [imageBoxes, setValue]);

//   // مقداردهی اولیه imageBoxes بر اساس files و فرم
//   useEffect(() => {
//     if (files && files.length > 0) {
//       const timer = setTimeout(() => {
//         // گروه‌بندی فایل‌ها بر اساس type فرم
//         const groups: Record<string, File[]> = {};
//         files.forEach((file, index) => {
//           const matched = imagesWithTypes![index];
//           const type = matched?.fileType || ''; // type از فرم

//           if (!groups[type]) groups[type] = [];
//           groups[type].push(file);
//         });

//         const initialBoxes: ImageBox[] = Object.entries(groups).map(([type, files]) => ({
//           fileType: type,
//           files,
//         }));
//         setImageBoxes(initialBoxes);
//       }, 0);

//       return () => clearTimeout(timer);
//     }
//   }, [files, getValues, imagesWithTypes]);

//   const addImageBox = () => {
//     setImageBoxes([...imageBoxes, { fileType: '', files: [] }]);
//   };

//   const handleTypeChange = (index: number, event: SelectChangeEvent<string>) => {
//     const newBoxes = [...imageBoxes];
//     newBoxes[index].fileType = event.target.value;
//     setImageBoxes(newBoxes);
//   };

//   const handleFilesChange = (index: number, files: File[]) => {
//     const newBoxes = [...imageBoxes];
//     newBoxes[index].files = files;
//     setImageBoxes(newBoxes);
//   };

//   const removeBox = (index: number) => {
//     setImageBoxes((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Button variant="soft" onClick={addImageBox}>
//         Add image
//       </Button>

//       <Box
//         sx={{
//           mt: 2,
//           display: 'grid',
//           rowGap: 3,
//           columnGap: 2,
//           gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
//         }}
//       >
//         {imageBoxes.map((box, index) => (
//           <Box
//             key={index}
//             sx={{
//               width: '100%',
//               border: '1px solid #ddd',
//               borderRadius: 2,
//               p: 2,
//               position: 'relative',
//             }}
//           >
//             <Box sx={{ mb: 2, textAlign: 'end' }}>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 size="small"
//                 onClick={() => removeBox(index)}
//               >
//                 Delete
//               </Button>
//             </Box>

//             {/* انتخاب نوع عکس از فرم */}
//             <FormControl fullWidth sx={{ mb: 1 }}>
//               <InputLabel>Image type</InputLabel>
//               <Select
//                 label="Image type"
//                 value={box.fileType}
//                 onChange={(e) => handleTypeChange(index, e)}
//               >
//                 <MenuItem value="Front">Front</MenuItem>
//                 <MenuItem value="Back">Back</MenuItem>
//                 <MenuItem value="Deed">Deed</MenuItem>
//               </Select>
//             </FormControl>

//             <Upload
//               multiple
//               value={box.files}
//               onDrop={(files: (File | string)[]) => {
//                 handleFilesChange(index, [
//                   ...box.files,
//                   ...files.filter((f): f is File => f instanceof File),
//                 ]);
//               }}
//               onRemove={(file: string | File) => {
//                 if (file instanceof File) {
//                   handleFilesChange(
//                     index,
//                     box.files.filter((f) => f !== file)
//                   );
//                 }
//               }}
//             />
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }
