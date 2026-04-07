import { StepItem } from "@/types/step";

export const STEPS: StepItem[] = [
    {
      number: 1,
      text: 'Làm nóng lò nướng ở nhiệt độ 200°C.',
      tip: 'Đảm bảo lò đã đủ nóng trước khi đặt bánh vào để đảm bảo bánh chín đều.',
    },
    {
      number: 2,
      text: 'Phết đều sốt cà chua lên đế bánh pizza.',
      tip: 'Không nên phết quá nhiều sốt để tránh làm bánh bị ướt.',
    },
    {
      number: 3,
      text: 'Rải đều phô mai bào sợi lên trên lớp sốt cà chua.',
      tip: 'Dùng phô mai mozzarella để có độ kéo sợi tốt nhất.',
    },
    {
      number: 4,
      text: 'Thêm ớt chuông thái nhỏ lên trên lớp phô mai.',
      tip: 'Có thể thêm các loại rau củ khác như hành tây hoặc nấm nếu muốn.',
    },
    {
      number: 5,
      text: 'Đặt bánh vào lò nướng và nướng trong khoảng 15–20 phút cho đến khi phô mai chảy và có màu vàng nâu.',
      tip: 'Kiểm tra bánh sau 15 phút để tránh bị cháy.',
    },
    {
      number: 6,
      text: 'Lấy bánh ra khỏi lò, để nguội trong vài phút trước khi cắt và thưởng thức.',
      tip: 'Dùng dao sắc để cắt bánh dễ dàng hơn.',
      isLast: true,
    },
  ];

export const INITIAL_STEPS: StepItem[] = [
    {
      id: 's1',
      text: 'Luộc mì sợi trong nồi nước sôi đến khi vừa chín, vớt ra xả nhanh với nước lạnh và để ráo.',
      tip: 'Không luộc mì sợi quá lâu để sợi mì còn dai và không bị bở khi cho vào nước dùng nóng.',
    },
    {
      id: 's2',
      text: 'Đun nóng dầu ăn trong nồi, cho tỏi băm và hành tây thái lát vào phi thơm trên lửa vừa.',
      tip: 'Thịt heo thái thật mỏng để chín nhanh và mềm, không xào quá lâu làm thịt khô.',
    },
    {
      id: 's3',
      text: 'Đổ nước dùng gà vào nồi, thêm sốt cà chua, nước tương, nước mắm, sa tế ớt, muối, đường và tiêu đen, khuấy đều.',
      tip: 'Nêm nếm lại nước dùng gà cho vừa khẩu vị trước khi đun sôi lâu để tránh bị quá mặn.',
    },
    {
      id: 's4',
      text: 'Đun sôi nước dùng gà rồi hạ lửa nhỏ, nấu thêm 10 phút cho thịt heo chín mềm và nước dùng đậm vị.',
      tip: 'Hớt bọt trên mặt nước dùng gà để nước trong và có màu đẹp hơn.',
    },
    {
      id: 's5',
      text: 'Chia mì sợi vào 2 tô, chan nước dùng gà nóng cùng thịt heo lên trên, rắc hành phi và vắt chanh khi ăn.',
      tip: 'Chan nước dùng gà thật nóng lên mì sợi để mì ấm đều, thêm sa tế ớt nếu thích ăn cay hơn.',
    },
  ];