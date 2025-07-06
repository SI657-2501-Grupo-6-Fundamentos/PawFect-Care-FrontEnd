/*
    private Long id;
    @Enumerated(EnumType.STRING)
    private AvailableDays availableDays;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Long veterinarianId;
 */

export class Schedule {
  id: number;
  availableDays: string;
  startDateTime:string;
  endDateTime:string;
  veterinarianId: number;

  constructor(schedule: {
    id?: number;
    availableDays?: string;
    startDateTime?:string;
    endDateTime?:string
    veterinarianId?: number;
  }) {
    this.id = schedule.id || 0;
    this.availableDays = schedule.availableDays || '';
    this.startDateTime=schedule.startDateTime || '';
    this.endDateTime=schedule.endDateTime || '';
    this.veterinarianId = schedule.veterinarianId || 0;
  }
}
